import { beforeEach, describe, expect, it, vi } from "vitest";
import { openDB } from "idb";
import { IndexedDbLetterRepository as Repository } from "../repositories/IndexedDbLetterRepository";
import { fixture } from "./fixtures";
// These tests use fake-indexeddb; they do not claim real-browser persistence coverage.
let name: string;
let repo: Repository;
const input = () => ({
  type: "unsent" as const,
  owner: { kind: "local" as const, localId: "device" },
  content: "你好",
});
beforeEach(() => {
  name = crypto.randomUUID();
  repo = new Repository("device", name);
});
describe("模擬 IndexedDB repository", () => {
  it("Create / Read / List / Update / Private / Delete 與 revision", async () => {
    const letter = await repo.createDraft(input());
    expect(letter.revision).toBe(1);
    expect(await repo.getById(letter.id)).toEqual(letter);
    expect(await repo.listLocal()).toEqual([letter]);
    const updated = await repo.saveDraft(letter.id, "更新內容", 1);
    expect(updated.revision).toBe(2);
    const saved = await repo.savePrivate(letter.id, 2);
    expect(saved.lifecycle).toBe("private");
    expect(saved.revision).toBe(3);
    await expect(repo.saveDraft(letter.id, "不可以", 3)).rejects.toMatchObject({
      code: "LOCKED",
    });
    await repo.delete(letter.id, 3);
    expect(await repo.getById(letter.id)).toBeNull();
    expect(await repo.listLocal()).toEqual([]);
  });
  it("不存在的信件不得回報更新或刪除成功", async () => {
    expect(await repo.getById("missing")).toBeNull();
    await expect(repo.saveDraft("missing", "", 1)).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
    await expect(repo.savePrivate("missing", 1)).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
    await expect(repo.delete("missing")).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });
  it("舊版本儲存、轉私人與刪除皆不可覆蓋", async () => {
    const l = await repo.createDraft(input());
    await repo.saveDraft(l.id, "新版", 1);
    await expect(repo.saveDraft(l.id, "舊版", 1)).rejects.toMatchObject({
      code: "REVISION_CONFLICT",
    });
    await expect(repo.savePrivate(l.id, 1)).rejects.toMatchObject({
      code: "REVISION_CONFLICT",
    });
    await expect(repo.delete(l.id, 1)).rejects.toMatchObject({
      code: "REVISION_CONFLICT",
    });
    expect((await repo.getById(l.id))?.content).toBe("新版");
  });
  it("兩個獨立實例同時修改只能一個成功", async () => {
    const other = new Repository("device", name);
    const l = await repo.createDraft(input());
    const results = await Promise.allSettled([
      repo.saveDraft(l.id, "A", 1),
      other.saveDraft(l.id, "B", 1),
    ]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    const rejected = results.find(
      (r) => r.status === "rejected",
    ) as PromiseRejectedResult;
    expect(rejected.reason.code).toBe("REVISION_CONFLICT");
    expect((await repo.getById(l.id))?.revision).toBe(2);
  });
  it("拒絕非法輸入與帳號、本機身份混用", async () => {
    await expect(
      repo.createDraft({ ...input(), type: "invalid" as "unsent" }),
    ).rejects.toMatchObject({ code: "VALIDATION" });
    await expect(
      repo.createDraft({
        ...input(),
        owner: { kind: "account", userId: "user" },
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    const l = await repo.createDraft(input());
    const stranger = new Repository("other-device", name);
    expect(await stranger.getById(l.id)).toBeNull();
    expect(await stranger.listLocal()).toEqual([]);
    await expect(stranger.delete(l.id)).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
    await expect(repo.saveDraft(l.id, "", 0)).rejects.toMatchObject({
      code: "VALIDATION",
    });
  });
  it("拒絕已損壞的持久化資料", async () => {
    await repo.createDraft(input());
    const db = await openDB(name);
    await db.put("letters", { id: "bad", content: 42 });
    db.close();
    await expect(repo.getById("bad")).rejects.toMatchObject({
      code: "VALIDATION",
    });
    await expect(repo.listLocal()).rejects.toMatchObject({
      code: "VALIDATION",
    });
  });
  it("封存資料不能透過 repository 編輯或改為私人，但可刪除", async () => {
    await repo.createDraft(input());
    const sealed = {
      ...fixture(),
      type: "time-letter",
      lifecycle: "sealed",
      unlockAt: "2030-01-01T00:00:00Z",
      timezone: "Asia/Taipei",
    };
    const db = await openDB(name);
    await db.put("letters", sealed);
    db.close();
    await expect(repo.saveDraft(sealed.id, "新內容", 1)).rejects.toMatchObject({
      code: "LOCKED",
    });
    await expect(repo.savePrivate(sealed.id, 1)).rejects.toMatchObject({
      code: "INVALID_TRANSITION",
    });
    await repo.delete(sealed.id);
    expect(await repo.getById(sealed.id)).toBeNull();
  });
  it("IndexedDB 不可用時提供明確錯誤", async () => {
    vi.stubGlobal("indexedDB", undefined);
    try {
      await expect(repo.listLocal()).rejects.toMatchObject({
        code: "UNAVAILABLE",
      });
    } finally {
      vi.unstubAllGlobals();
    }
  });
  it("空間不足與寫入失敗不會成功回報", async () => {
    const l = await repo.createDraft(input());
    const spy = vi
      .spyOn(IDBObjectStore.prototype, "put")
      .mockImplementation(() => {
        throw new DOMException("Full", "QuotaExceededError");
      });
    await expect(repo.saveDraft(l.id, "不應寫入", 1)).rejects.toMatchObject({
      code: "QUOTA",
    });
    spy.mockRestore();
    expect((await repo.getById(l.id))?.revision).toBe(1);
  });
  it("request 成功後交易 abort：等待交易完成並回滾", async () => {
    const l = await repo.createDraft(input());
    const original = IDBObjectStore.prototype.put;
    const spy = vi
      .spyOn(IDBObjectStore.prototype, "put")
      .mockImplementation(function (
        this: IDBObjectStore,
        ...args: Parameters<IDBObjectStore["put"]>
      ) {
        const request = original.apply(this, args);
        request.addEventListener("success", () => this.transaction.abort());
        return request;
      });
    await expect(repo.saveDraft(l.id, "回滾", 1)).rejects.toMatchObject({
      code: "STORAGE",
    });
    spy.mockRestore();
    expect((await repo.getById(l.id))?.content).toBe("你好");
    expect((await repo.getById(l.id))?.revision).toBe(1);
  });
  it("新建交易 abort 時不留下信件", async () => {
    const original = IDBObjectStore.prototype.add;
    const spy = vi
      .spyOn(IDBObjectStore.prototype, "add")
      .mockImplementation(function (
        this: IDBObjectStore,
        ...args: Parameters<IDBObjectStore["add"]>
      ) {
        const request = original.apply(this, args);
        request.addEventListener("success", () => this.transaction.abort());
        return request;
      });
    await expect(repo.createDraft(input())).rejects.toMatchObject({
      code: "STORAGE",
    });
    spy.mockRestore();
    expect(await repo.listLocal()).toEqual([]);
  });
  it("建立交易失敗會轉成明確儲存錯誤", async () => {
    const l = await repo.createDraft(input());
    const spy = vi
      .spyOn(IDBDatabase.prototype, "transaction")
      .mockImplementation(() => {
        throw new DOMException("Transaction unavailable", "InvalidStateError");
      });
    await expect(repo.saveDraft(l.id, "失敗", 1)).rejects.toMatchObject({
      code: "STORAGE",
    });
    spy.mockRestore();
    expect((await repo.getById(l.id))?.revision).toBe(1);
  });
  it("省略必填 revision 也不能繞過版本檢查", async () => {
    const l = await repo.createDraft(input());
    await expect(
      repo.saveDraft(l.id, "失敗", undefined as unknown as number),
    ).rejects.toMatchObject({ code: "VALIDATION" });
    await expect(
      repo.savePrivate(l.id, undefined as unknown as number),
    ).rejects.toMatchObject({ code: "VALIDATION" });
    expect((await repo.getById(l.id))?.revision).toBe(1);
  });
  it("較新版本資料庫不得降級覆寫", async () => {
    const db = await openDB(name, 2);
    db.close();
    await expect(repo.listLocal()).rejects.toMatchObject({ code: "UPGRADE" });
  });
  it("升級失敗不會成功回報", async () => {
    const spy = vi
      .spyOn(IDBDatabase.prototype, "createObjectStore")
      .mockImplementation(function () {
        // Abort rather than throwing out of an event callback.
        throw new DOMException("Failed migration", "AbortError");
      });
    await expect(repo.listLocal()).rejects.toMatchObject({ code: "UPGRADE" });
    spy.mockRestore();
  });
  it("升級被其他分頁阻擋時明確回報", async () => {
    // A version-1 tab blocks an injected version-2 open request.
    const blockedName = crypto.randomUUID();
    const raw = indexedDB.open(blockedName);
    const blocker: IDBDatabase = await new Promise((resolve) => {
      raw.onsuccess = () => resolve(raw.result);
    });
    // Force the next open to request an upgrade, simulating an older tab.
    const open = indexedDB.open.bind(indexedDB);
    const spy = vi
      .spyOn(indexedDB, "open")
      .mockImplementation((dbName, version) =>
        open(dbName, dbName === blockedName ? 2 : version),
      );
    await expect(
      new Repository("device", blockedName).listLocal(),
    ).rejects.toMatchObject({ code: "UPGRADE" });
    blocker.close();
    spy.mockRestore();
    await new Promise((resolve) => setTimeout(resolve, 10));
  });
});
