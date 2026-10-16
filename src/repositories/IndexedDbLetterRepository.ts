import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Letter, CreateDraftInput } from "../domain/letter.types";
import { LetterError } from "../domain/letter.errors";
import { validateLetter } from "../domain/letter.validation";
import { editDraft, transitionLetter } from "../domain/letter.lifecycle";
import type { LetterRepository } from "./LetterRepository";
interface LetterDatabase extends DBSchema {
  letters: { key: string; value: Letter };
}
export const DATABASE_VERSION = 1;
export const DATABASE_NAME = "unsent-messages";
function storageError(error: unknown): LetterError {
  if (error instanceof LetterError) return error;
  const name =
    error instanceof Error || error instanceof DOMException ? error.name : "";
  if (name === "QuotaExceededError")
    return new LetterError("QUOTA", "裝置儲存空間不足，信件未儲存。", {
      cause: error,
    });
  if (name === "VersionError")
    return new LetterError("UPGRADE", "資料庫版本不相容，請更新頁面。", {
      cause: error,
    });
  return new LetterError("STORAGE", "本機資料操作失敗，請重試。", {
    cause: error,
  });
}
export class IndexedDbLetterRepository implements LetterRepository {
  // Each instance scopes access to one local identity. No account data is accepted here.
  constructor(
    private readonly localId: string,
    private readonly databaseName = DATABASE_NAME,
  ) {
    if (!localId.trim())
      throw new LetterError("VALIDATION", "缺少本機使用者識別碼。");
  }
  private async open(): Promise<IDBPDatabase<LetterDatabase>> {
    if (!globalThis.indexedDB)
      throw new LetterError("UNAVAILABLE", "此瀏覽器無法使用本機信箱。");
    try {
      return await new Promise((resolve, reject) => {
        let blocked = false;
        const request = openDB<LetterDatabase>(
          this.databaseName,
          DATABASE_VERSION,
          {
            upgrade(db, oldVersion, _newVersion, tx) {
              void tx.done.catch(() => {});
              try {
                if (oldVersion < 1)
                  db.createObjectStore("letters", { keyPath: "id" });
              } catch (error) {
                tx.abort();
                reject(
                  new LetterError(
                    "UPGRADE",
                    "資料庫升級失敗，原有資料未變更。",
                    { cause: error },
                  ),
                );
              }
            },
            blocked() {
              blocked = true;
              reject(
                new LetterError(
                  "UPGRADE",
                  "資料庫升級被其他分頁阻擋，請關閉舊分頁。",
                ),
              );
            },
            blocking(_current, _next, event) {
              (event.target as IDBDatabase).close();
            },
          },
        );
        request.then((db) => {
          if (blocked) db.close();
          else resolve(db);
        }, reject);
      });
    } catch (error) {
      throw storageError(error);
    }
  }
  private owned(value: unknown): Letter {
    validateLetter(value);
    if (value.owner.kind !== "local" || value.owner.localId !== this.localId)
      throw new LetterError("NOT_FOUND", "找不到這封信。");
    return value;
  }
  private requireRevision(expected: number) {
    if (!Number.isSafeInteger(expected) || expected < 1)
      throw new LetterError("VALIDATION", "版本號無效。");
  }
  private checkRevision(letter: Letter, expected: number) {
    this.requireRevision(expected);
    if (letter.revision !== expected)
      throw new LetterError(
        "REVISION_CONFLICT",
        "信件已在其他分頁更新，請重新讀取後再試。",
      );
  }
  async createDraft(input: CreateDraftInput): Promise<Letter> {
    const now = new Date().toISOString();
    const letter: Letter = {
      ...input,
      id: crypto.randomUUID(),
      content: input.content ?? "",
      lifecycle: "draft",
      createdAt: now,
      updatedAt: now,
      revision: 1,
    };
    this.owned(letter);
    const db = await this.open();
    try {
      const tx = db.transaction("letters", "readwrite");
      await Promise.all([tx.store.add(letter), tx.done]);
      return letter;
    } catch (error) {
      throw storageError(error);
    } finally {
      db.close();
    }
  }
  async getById(id: string): Promise<Letter | null> {
    const db = await this.open();
    try {
      const tx = db.transaction("letters", "readonly");
      const [value] = await Promise.all([tx.store.get(id), tx.done]);
      if (!value) return null;
      validateLetter(value);
      if (value.owner.kind !== "local" || value.owner.localId !== this.localId)
        return null;
      return value;
    } catch (error) {
      throw storageError(error);
    } finally {
      db.close();
    }
  }
  async listLocal(): Promise<Letter[]> {
    const db = await this.open();
    try {
      const tx = db.transaction("letters", "readonly");
      const [letters] = await Promise.all([tx.store.getAll(), tx.done]);
      letters.forEach(validateLetter);
      return letters
        .filter(
          (l) =>
            l.owner.kind === "local" &&
            l.owner.localId === this.localId &&
            l.lifecycle !== "deleted",
        )
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    } catch (error) {
      throw storageError(error);
    } finally {
      db.close();
    }
  }
  private async mutate(
    id: string,
    expectedRevision: number | undefined,
    change: (letter: Letter) => Letter | null,
  ): Promise<Letter | null> {
    const db = await this.open();
    try {
      const tx = db.transaction("letters", "readwrite");
      // Attach a rejection handler immediately; domain errors also abort the transaction.
      const completion = tx.done;
      void completion.catch(() => {});
      try {
        const existing = await tx.store.get(id);
        if (!existing) throw new LetterError("NOT_FOUND", "找不到這封信。");
        const letter = this.owned(existing);
        if (expectedRevision !== undefined)
          this.checkRevision(letter, expectedRevision);
        const updated = change(letter);
        if (updated) {
          validateLetter(updated);
          await tx.store.put(updated);
        } else await tx.store.delete(id);
        await completion;
        return updated;
      } catch (error) {
        try {
          tx.abort();
        } catch {
          /* Transaction may already be finished. */
        }
        await completion.catch(() => {});
        throw storageError(error);
      }
    } catch (error) {
      throw storageError(error);
    } finally {
      db.close();
    }
  }
  async saveDraft(
    id: string,
    content: string,
    expectedRevision: number,
  ): Promise<Letter> {
    this.requireRevision(expectedRevision);
    return (await this.mutate(id, expectedRevision, (l) =>
      editDraft(l, content),
    ))!;
  }
  async savePrivate(id: string, expectedRevision: number): Promise<Letter> {
    this.requireRevision(expectedRevision);
    return (await this.mutate(id, expectedRevision, (l) =>
      transitionLetter(l, "private"),
    ))!;
  }
  async delete(id: string, expectedRevision?: number): Promise<void> {
    await this.mutate(id, expectedRevision, (l) => {
      transitionLetter(l, "deleted");
      return null;
    });
  }
}
