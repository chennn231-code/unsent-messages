import type { Letter } from "./letter.types";
import { LetterError } from "./letter.errors";
const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isDate = (value: unknown): value is string =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(
    value,
  ) &&
  Number.isFinite(Date.parse(value)) &&
  (() => {
    const day = value.slice(0, 10);
    return new Date(`${day}T00:00:00Z`).toISOString().slice(0, 10) === day;
  })();
export function validateLetter(value: unknown): asserts value is Letter {
  const fail = () => {
    throw new LetterError("VALIDATION", "信件資料格式不正確。");
  };
  if (!value || typeof value !== "object") return fail();
  const l = value as Record<string, unknown>;
  if (typeof l.id !== "string" || !uuid.test(l.id)) fail();
  if (l.type !== "unsent" && l.type !== "time-letter") fail();
  if (
    typeof l.lifecycle !== "string" ||
    !["draft", "private", "sealed", "opened", "deleted"].includes(l.lifecycle)
  )
    fail();
  const owner = l.owner as Record<string, unknown> | undefined;
  if (!owner || (owner.kind !== "local" && owner.kind !== "account")) fail();
  const ownerId = owner?.kind === "local" ? owner.localId : owner?.userId;
  if (typeof ownerId !== "string" || !ownerId.trim()) fail();
  if (
    typeof l.content !== "string" ||
    !Number.isSafeInteger(l.revision) ||
    (l.revision as number) < 1
  )
    fail();
  if (
    !isDate(l.createdAt) ||
    !isDate(l.updatedAt) ||
    Date.parse(l.updatedAt as string) < Date.parse(l.createdAt as string)
  )
    fail();
  if (l.unlockAt !== undefined && !isDate(l.unlockAt)) fail();
  if (l.timezone !== undefined) {
    if (typeof l.timezone !== "string" || !l.timezone.trim()) fail();
    try {
      Intl.DateTimeFormat("en", { timeZone: l.timezone as string });
    } catch {
      fail();
    }
  }
  if (
    l.type === "unsent" &&
    (l.unlockAt !== undefined ||
      l.timezone !== undefined ||
      l.lifecycle === "sealed" ||
      l.lifecycle === "opened")
  )
    fail();
  if (
    l.type === "time-letter" &&
    ["sealed", "opened"].includes(String(l.lifecycle)) &&
    (!l.unlockAt ||
      !l.timezone ||
      Date.parse(l.unlockAt as string) <= Date.parse(l.createdAt as string))
  )
    fail();
}
