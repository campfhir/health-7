/** The OkResult type. */
export type OkResult<T = unknown> = T extends void
  ? {
      ok: true;
      val?: never;
      err?: never;
    }
  : {
      ok: true;
      val: T;
      err?: never;
    };
