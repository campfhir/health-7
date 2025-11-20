import { BaseSegment } from "../../types/segment";

export class OBX extends BaseSegment {
  name = "OBX";

  constructor() {
    super();
    this.fields = [];
  }

  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }
  valueType(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }
  observationIdentifier(
    identifier: string,
    text?: string,
    nameOfCodingSystem?: string,
  ): this {
    const components = [identifier];
    if (text) components.push(text);
    if (nameOfCodingSystem) components.push(nameOfCodingSystem);

    this.fields[2] = this.createField(components);
    return this;
  }
  observationSubId(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }
  observationValue(value: string | string[]): this {
    this.fields[4] = this.createField(value);
    return this;
  }
  units(identifier?: string, text?: string, nameOfCodingSystem?: string): this {
    const components = [];
    if (identifier) components.push(identifier);
    if (text) components.push(text);
    if (nameOfCodingSystem) components.push(nameOfCodingSystem);

    this.fields[5] = this.createField(components);
    return this;
  }
  referenceRange(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }
  abnormalFlags(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }
  probability(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }
  natureOfAbnormalTest(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }
  observationResultStatus(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }
  effectiveDateOfReferenceRange(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }
  userDefinedAccessChecks(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }
  dateTimeOfObservation(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }
  producersId(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }
  responsibleObserver(
    id: string,
    familyName?: string,
    givenName?: string,
  ): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[15] = this.createField(components);
    return this;
  }
  observationMethod(
    identifier?: string,
    text?: string,
    nameOfCodingSystem?: string,
  ): this {
    const components = [];
    if (identifier) components.push(identifier);
    if (text) components.push(text);
    if (nameOfCodingSystem) components.push(nameOfCodingSystem);

    this.fields[16] = this.createField(components);
    return this;
  }

  /**
   * Get abnormal flags from OBX-8
   * Returns array of abnormal flag codes (e.g., ["H"], ["L"], ["HH"], ["LL"], ["A"], etc.)
   */
  getAbnormalFlags(): string[] {
    if (!this.fields[7]) {
      return [];
    }

    const flagField = this.fields[7];
    if (!flagField.components || flagField.components.length === 0) {
      return [];
    }

    // Get the first component's subcomponents
    const firstComponent = flagField.components[0];
    if (
      !firstComponent.subComponents ||
      firstComponent.subComponents.length === 0
    ) {
      return [];
    }

    // Filter out empty strings and return
    return firstComponent.subComponents.filter(
      (flag) => flag && flag.trim().length > 0,
    );
  }
}
