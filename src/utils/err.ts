export class Err<S extends string> extends Error {
  message: S;
  cause?: Error | Err<any>;
  meta?: Record<string, any>;
  constructor(s: S, opt?: ErrorOptions) {
    super(s, opt);
    this.message = s;
  }
  addCause(c: Error | Err<any> | string): Err<S> {
    this.cause = typeof c === "string" ? new Err(c) : c;
    return this;
  }
  withMetadata(m: Record<string, any>): Err<S> {
    this.meta = m;
    return this;
  }
  toString(): string {
    let str = this.message as string;
    if (this.cause) {
      str += `\nCaused by: ${this.cause}`;
    }
    if (this.meta) {
      str += `\nMetadata: ${JSON.stringify(this.meta)}`;
    }
    return str;
  }
}
