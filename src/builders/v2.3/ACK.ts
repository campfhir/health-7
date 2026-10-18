/**
 * Builder for ACK messages (HL7 v2.3): MSH, MSA, [ERR].
 *
 * @module
 */
import type { MSH } from "../../segments/v2.3/MSH.ts";
import type { MSA } from "../../segments/v2.3/MSA.ts";
import type { ERR } from "../../segments/v2.3/ERR.ts";
import { type EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding.ts";

/** Builder for HL7 ACK (v2.3) messages. */
export class ACK<
  TMsh extends MSH = MSH,
  TMsa extends MSA = MSA,
  TErr extends ERR = ERR,
> {
  /** Constructor. */
  constructor(
    public msh: TMsh,
    public msa: TMsa,
    public err?: TErr,
    private encoding: EncodingCharacters = DEFAULT_ENCODING,
  ) {}

  /** Validates the message structure, returning a result. */
  verify(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!this.msh) errors.push("MSH segment is required");
    if (!this.msa) errors.push("MSA segment is required");
    return { valid: errors.length === 0, errors };
  }

  /** Encodes this message to its HL7 wire string. */
  encode(): string {
    const verification = this.verify();
    if (!verification.valid) {
      throw new Error(
        `Cannot encode invalid ACK message:\n${verification.errors.join("\n")}`,
      );
    }

    const segments = [this.msh.encode(this.encoding), this.msa.encode(this.encoding)];
    if (this.err) segments.push(this.err.encode(this.encoding));
    return segments.join("\r");
  }
}

/** Builds an HL7 ACK (v2.3) message. */
export function createACK<
  TMsh extends MSH = MSH,
  TMsa extends MSA = MSA,
  TErr extends ERR = ERR,
>(msh: TMsh, msa: TMsa, err?: TErr): ACK<TMsh, TMsa, TErr> {
  return new ACK(msh, msa, err);
}
