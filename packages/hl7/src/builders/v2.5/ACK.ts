/**
 * Builder for ACK messages (HL7 v2.5): MSH, [{SFT}], MSA, [{ERR}].
 *
 * @module
 */
import type { MSH } from "../../segments/v2.5/MSH.ts";
import type { SFT } from "../../segments/v2.5/SFT.ts";
import type { MSA } from "../../segments/v2.5/MSA.ts";
import type { ERR } from "../../segments/v2.5/ERR.ts";
import { type EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding.ts";

/** Builder for HL7 ACK (v2.5) messages. */
export class ACK<
  TMsh extends MSH = MSH,
  TMsa extends MSA = MSA,
> {
  /** Constructor. */
  constructor(
    public msh: TMsh,
    public msa: TMsa,
    public options: {
      /** SFT segments, encoded between MSH and MSA. */
      sftList?: SFT[];
      /** ERR segments, encoded after MSA. */
      errList?: ERR[];
    } = {},
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

    const enc = this.encoding;
    const segments = [this.msh.encode(enc)];
    this.options.sftList?.forEach((s) => segments.push(s.encode(enc)));
    segments.push(this.msa.encode(enc));
    this.options.errList?.forEach((e) => segments.push(e.encode(enc)));
    return segments.join("\r");
  }
}

/** Builds an HL7 ACK (v2.5) message. */
export function createACK<
  TMsh extends MSH = MSH,
  TMsa extends MSA = MSA,
>(
  msh: TMsh,
  msa: TMsa,
  options: ACK<TMsh, TMsa>["options"] = {},
): ACK<TMsh, TMsa> {
  return new ACK(msh, msa, options);
}
