import type { CreateDraftInput, Letter } from "../domain/letter.types";
export type { CreateDraftInput } from "../domain/letter.types";
export interface LetterRepository {
  createDraft(input: CreateDraftInput): Promise<Letter>;
  getById(id: string): Promise<Letter | null>;
  listLocal(): Promise<Letter[]>;
  saveDraft(
    id: string,
    content: string,
    expectedRevision: number,
  ): Promise<Letter>;
  savePrivate(id: string, expectedRevision: number): Promise<Letter>;
  // Optional to preserve the requested interface; callers can protect deletion against stale versions.
  delete(id: string, expectedRevision?: number): Promise<void>;
}
