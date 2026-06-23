// Re-exported from @caffeineai/core-infrastructure
// Do NOT recreate this file — it is provided by the platform package.
import { useActor as _useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type { Backend } from "../backend";

/**
 * Returns { actor, isFetching } for the backend canister.
 * Wraps the platform useActor() with the project's createActor.
 */
export function useActor(): { actor: Backend | null; isFetching: boolean } {
  return _useActor(createActor);
}
