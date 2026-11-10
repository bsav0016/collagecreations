// Request and response shapes, generated from the backend's public OpenAPI schema (see scripts/api-types.mjs).
// Use these instead of writing a shape by hand: when the backend changes a field, the build fails here.
import type { components } from "./schema";

export type Schemas = components["schemas"];
export type Schema<K extends keyof Schemas> = Schemas[K];
export type OrderType = Schema<"OrderTypeEnum">;
