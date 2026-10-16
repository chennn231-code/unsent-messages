import type { Letter } from "../domain/letter.types";
export const fixture = (): Letter => ({
  id: crypto.randomUUID(),
  type: "unsent",
  owner: { kind: "local", localId: "device" },
  lifecycle: "draft",
  content: "還沒說出口",
  revision: 1,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});
