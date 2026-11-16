import "server-only";

import { toPublicHome } from "./to-public-home";

export function isContentPreview() {
  if (process.env.CONTENT_MODE === "production") return false;
  if (process.env.CONTENT_MODE === "preview") return true;
  return process.env.NODE_ENV !== "production";
}

export function getPublicHome() {
  return toPublicHome(isContentPreview());
}
