import type { Err } from "../utils/err.ts";

export type ErrResult<S extends string | unknown = unknown> = S extends string
  ? {
      ok: false;
      val?: never;
      err: Err<S>;
    }
  : {
      ok: false;
      val?: never;
      err: Err<string>;
    };
