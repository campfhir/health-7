import { ErrResult } from "./err";
import { OkResult } from "./okResult";

export type Result<T = unknown, S extends string | unknown = unknown> =
  | OkResult<T>
  | ErrResult<S>;

export type AsyncResult<T, S extends string = string> = Promise<Result<T, S>>;
