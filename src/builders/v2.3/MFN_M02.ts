import type { MSH } from "../../segments/v2.5.1/MSH.ts";
import type { MFI } from "../../segments/v2.3/MFI.ts";
import type { MFE } from "../../segments/v2.3/MFE.ts";
import type { STF } from "../../segments/v2.3/STF.ts";
import type { PRA } from "../../segments/v2.3/PRA.ts";
import { type EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding.ts";

export interface StaffEntry<
  TMfe extends MFE = MFE,
  TStf extends STF = STF,
  TPra extends PRA = PRA,
> {
  mfe: TMfe;
  stf: TStf;
  pra?: TPra;
}

export class MFN_M02<
  TMfi extends MFI = MFI,
  TMfe extends MFE = MFE,
  TStf extends STF = STF,
  TPra extends PRA = PRA,
> {
  constructor(
    public msh: MSH,
    public mfi: TMfi,
    public staffEntries: StaffEntry<TMfe, TStf, TPra>[] = [],
    private encoding: EncodingCharacters = DEFAULT_ENCODING,
  ) {}

  verify(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.msh) {
      errors.push("MSH segment is required");
    }

    if (!this.mfi) {
      errors.push("MFI segment is required");
    }

    if (this.staffEntries.length === 0) {
      errors.push("At least one staff entry (MFE + STF) is required");
    }

    for (let i = 0; i < this.staffEntries.length; i++) {
      const entry = this.staffEntries[i];
      if (!entry.mfe) {
        errors.push(`Staff entry ${i + 1}: MFE segment is required`);
      }
      if (!entry.stf) {
        errors.push(`Staff entry ${i + 1}: STF segment is required`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  encode(): string {
    const verification = this.verify();
    if (!verification.valid) {
      throw new Error(
        `Cannot encode invalid MFN_M02 message:\n${verification.errors.join("\n")}`,
      );
    }

    const segments: string[] = [];

    segments.push(this.msh.encode(this.encoding));
    segments.push(this.mfi.encode(this.encoding));

    for (const entry of this.staffEntries) {
      segments.push(entry.mfe.encode(this.encoding));
      segments.push(entry.stf.encode(this.encoding));
      if (entry.pra) {
        segments.push(entry.pra.encode(this.encoding));
      }
    }

    return segments.join("\r");
  }
}

export function createMFN_M02<
  TMfi extends MFI = MFI,
  TMfe extends MFE = MFE,
  TStf extends STF = STF,
  TPra extends PRA = PRA,
>(
  msh: MSH,
  mfi: TMfi,
  staffEntries: StaffEntry<TMfe, TStf, TPra>[] = [],
): MFN_M02<TMfi, TMfe, TStf, TPra> {
  return new MFN_M02(msh, mfi, staffEntries);
}
