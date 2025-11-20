import { BaseSegment } from "../../types/segment";

export class OBR extends BaseSegment {
  name = "OBR";

  constructor() {
    super();
    this.fields = [];
  }

  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }
  placerOrderNumber(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }
  fillerOrderNumber(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }
  universalServiceIdentifier(
    identifier: string,
    text?: string,
    nameOfCodingSystem?: string,
  ): this {
    const components = [identifier];
    if (text) components.push(text);
    if (nameOfCodingSystem) components.push(nameOfCodingSystem);

    this.fields[3] = this.createField(components);
    return this;
  }
  priority(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }
  requestedDateTime(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }
  observationDateTime(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }
  observationEndDateTime(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }
  collectionVolume(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }
  collectorIdentifier(
    id: string,
    familyName?: string,
    givenName?: string,
  ): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[9] = this.createField(components);
    return this;
  }
  specimenActionCode(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }
  dangerCode(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }
  relevantClinicalInfo(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }
  specimenReceivedDateTime(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }
  specimenSource(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }
  orderingProvider(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[15] = this.createField(components);
    return this;
  }
  orderCallbackPhoneNumber(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }
  placerField1(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }
  placerField2(value: string): this {
    this.fields[18] = this.createField(value);
    return this;
  }
  fillerField1(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }
  fillerField2(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }
  resultsRptStatusChngDateTime(value: string): this {
    this.fields[21] = this.createField(value);
    return this;
  }
  chargeToPractice(value: string): this {
    this.fields[22] = this.createField(value);
    return this;
  }
  diagnosticServSectId(value: string): this {
    this.fields[23] = this.createField(value);
    return this;
  }
  resultStatus(value: string): this {
    this.fields[24] = this.createField(value);
    return this;
  }
}
