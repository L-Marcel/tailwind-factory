import { randomBytes } from "node:crypto";

export function generateId() {
  return randomBytes(6).toString("hex");
}
