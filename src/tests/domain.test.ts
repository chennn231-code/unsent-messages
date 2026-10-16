import { describe, expect, it } from "vitest";
import { validateLetter } from "../domain/letter.validation";
import { editDraft, transitionLetter } from "../domain/letter.lifecycle";
import type { Letter } from "../domain/letter.types";
import { fixture } from "./fixtures";
describe("信件資料與生命週期", () => {
  it("接受合法信件、空白草稿與帳號擁有者", () => {
    expect(() => validateLetter(fixture())).not.toThrow();
    expect(() =>
      validateLetter({
        ...fixture(),
        content: "",
        owner: { kind: "account", userId: "future-user" },
      }),
    ).not.toThrow();
  });
  it.each([
    "id",
    "type",
    "owner",
    "lifecycle",
    "content",
    "createdAt",
    "updatedAt",
    "revision",
  ])("拒絕缺少 %s", (key) => {
    const value: Record<string, unknown> = { ...fixture() };
    delete value[key];
    expect(() => validateLetter(value)).toThrow();
  });
  it.each([
    { lifecycle: "published" },
    { lifecycle: { toString: (): string => "draft" } },
    { revision: 0 },
    { revision: 1.5 },
    { id: "not-uuid" },
    { createdAt: "yesterday" },
    { createdAt: "2026-02-30T00:00:00Z" },
    { updatedAt: "2025-01-01T00:00:00Z" },
    { timezone: "Moon" },
    { type: "unsent", unlockAt: "2027-01-01T00:00:00Z" },
    { owner: { kind: "local", localId: " " } },
  ])("拒絕非法欄位 %j", (patch) => {
    expect(() => validateLetter({ ...fixture(), ...patch })).toThrow();
  });
  it("draft → private → deleted，每次增加版本", () => {
    const saved = transitionLetter(fixture(), "private");
    expect(saved.revision).toBe(2);
    expect(transitionLetter(saved, "deleted").lifecycle).toBe("deleted");
  });
  it("阻擋非法轉換及普通信封存", () => {
    expect(() => transitionLetter(fixture(), "opened")).toThrow();
    expect(() => transitionLetter(fixture(), "sealed")).toThrow();
    expect(() =>
      transitionLetter(transitionLetter(fixture(), "deleted"), "draft"),
    ).toThrow();
    expect(() =>
      editDraft(transitionLetter(fixture(), "private"), "改寫"),
    ).toThrow();
  });
  it("時光信件封存後不能改寫、取消封存或提早拆封，但可以刪除", () => {
    const timeLetter: Letter = {
      ...fixture(),
      type: "time-letter",
      unlockAt: "2030-01-01T00:00:00Z",
      timezone: "Asia/Taipei",
    };
    const sealed = transitionLetter(
      timeLetter,
      "sealed",
      new Date("2026-01-02"),
    );
    expect(() => editDraft(sealed, "改寫")).toThrow();
    expect(() => transitionLetter(sealed, "draft")).toThrow();
    expect(() => transitionLetter(sealed, "private")).toThrow();
    expect(() =>
      transitionLetter(sealed, "opened", new Date("2029-12-31")),
    ).toThrow();
    expect(transitionLetter(sealed, "deleted").lifecycle).toBe("deleted");
    expect(
      transitionLetter(sealed, "opened", new Date("2030-01-01")).lifecycle,
    ).toBe("opened");
    expect(sealed.unlockAt).toBe(timeLetter.unlockAt);
  });
  it("拒絕缺少時間、時區與已過期的封存", () => {
    expect(() =>
      transitionLetter({ ...fixture(), type: "time-letter" }, "sealed"),
    ).toThrow();
    expect(() =>
      transitionLetter(
        {
          ...fixture(),
          type: "time-letter",
          unlockAt: "2026-01-02T00:00:00Z",
          timezone: "Asia/Taipei",
        },
        "sealed",
        new Date("2027-01-01"),
      ),
    ).toThrow();
    expect(() =>
      validateLetter({
        ...fixture(),
        type: "time-letter",
        lifecycle: "sealed",
      }),
    ).toThrow();
  });
});
