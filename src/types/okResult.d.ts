export type OkResult<T extends any = unknown> = T extends void
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
