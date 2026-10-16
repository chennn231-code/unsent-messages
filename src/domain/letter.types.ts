export type LetterType = "unsent" | "time-letter";
export type LetterLifecycle =
  "draft" | "private" | "sealed" | "opened" | "deleted";
export type Owner =
  { kind: "local"; localId: string } | { kind: "account"; userId: string };
export interface Letter {
  id: string;
  type: LetterType;
  owner: Owner;
  lifecycle: LetterLifecycle;
  content: string;
  createdAt: string;
  updatedAt: string;
  revision: number;
  unlockAt?: string;
  timezone?: string;
}
export type PublicationStatus =
  | "pending-withdrawal"
  | "pending-review"
  | "published"
  | "rejected"
  | "withdrawn";
export interface CreateDraftInput {
  type: LetterType;
  owner: Owner;
  content?: string;
  unlockAt?: string;
  timezone?: string;
}
