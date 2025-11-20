import { BaseSegment } from "../../types/segment";

export class ORC extends BaseSegment {
  name = "ORC";

  constructor() {
    super();
    this.fields = [];
  }

  orderControl(value: string): this {
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

  placerGroupNumber(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  orderStatus(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  responseFlag(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  quantityTiming(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  parent(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  dateTimeOfTransaction(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  enteredBy(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[9] = this.createField(components);
    return this;
  }

  verifiedBy(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[10] = this.createField(components);
    return this;
  }

  orderingProvider(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[11] = this.createField(components);
    return this;
  }

  enterersLocation(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  callBackPhoneNumber(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }

  orderEffectiveDateTime(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  orderControlCodeReason(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }

  enteringOrganization(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }

  enteringDevice(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }

  actionBy(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[18] = this.createField(components);
    return this;
  }
}
