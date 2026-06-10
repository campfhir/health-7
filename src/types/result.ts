import type { ErrResult } from "./err.ts";
import type { OkResult } from "./okResult.ts";

/** The Result type. */
export type Result<T = unknown, S extends string | unknown = unknown> =
  | OkResult<T>
  | ErrResult<S>;

/** The AsyncResult type. */
export type AsyncResult<T, S extends string = string> = Promise<Result<T, S>>;
