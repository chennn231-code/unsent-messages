import { LetterError } from "./letter.errors";
import type { Letter, LetterLifecycle } from "./letter.types";
import { validateLetter } from "./letter.validation";
const transitions: Record<LetterLifecycle, readonly LetterLifecycle[]> = {
  draft: ["private", "sealed", "deleted"],
  private: ["deleted"],
  sealed: ["opened", "deleted"],
  opened: ["deleted"],
  deleted: [],
};
/** Domain rule only. A future cloud implementation must use server time and isolate sealed bodies. */
export function transitionLetter(
  letter: Letter,
  next: LetterLifecycle,
  now = new Date(),
): Letter {
  validateLetter(letter);
  if (!Number.isFinite(now.getTime()))
    throw new LetterError("VALIDATION", "時間無效。");
  if (!transitions[letter.lifecycle].includes(next))
    throw new LetterError("INVALID_TRANSITION", "不允許這項信件狀態變更。");
  if (
    next === "sealed" &&
    (letter.type !== "time-letter" ||
      !letter.unlockAt ||
      !letter.timezone ||
      Date.parse(letter.unlockAt) <= now.getTime())
  )
    throw new LetterError("INVALID_TRANSITION", "封存需要未來解鎖時間及時區。");
  if (
    next === "opened" &&
    (!letter.unlockAt || now.getTime() < Date.parse(letter.unlockAt))
  )
    throw new LetterError("LOCKED", "這封信尚未到拆封時間。");
  const updated = {
    ...letter,
    lifecycle: next,
    revision: letter.revision + 1,
    updatedAt: new Date(
      Math.max(now.getTime(), Date.parse(letter.updatedAt)),
    ).toISOString(),
  };
  validateLetter(updated);
  return updated;
}
export function editDraft(
  letter: Letter,
  content: string,
  now = new Date(),
): Letter {
  validateLetter(letter);
  if (letter.lifecycle !== "draft")
    throw new LetterError("LOCKED", "只有草稿可以修改。");
  if (!Number.isFinite(now.getTime()))
    throw new LetterError("VALIDATION", "時間無效。");
  const updated = {
    ...letter,
    content,
    revision: letter.revision + 1,
    updatedAt: new Date(
      Math.max(now.getTime(), Date.parse(letter.updatedAt)),
    ).toISOString(),
  };
  validateLetter(updated);
  return updated;
}
