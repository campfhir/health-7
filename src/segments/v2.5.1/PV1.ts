import { BaseSegment } from "../../types/segment";

export class PV1 extends BaseSegment {
  name = "PV1";

  constructor() {
    super();
    this.fields = [];
  }

  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }
  patientClass(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }
  assignedPatientLocation(
    pointOfCare?: string,
    room?: string,
    bed?: string,
    facility?: string,
    locationStatus?: string,
    personLocationType?: string,
  ): this {
    const components = [];
    if (pointOfCare) components.push(pointOfCare);
    if (room) components.push(room);
    if (bed) components.push(bed);
    if (facility) components.push(facility);
    if (locationStatus) components.push(locationStatus);
    if (personLocationType) components.push(personLocationType);

    this.fields[2] = this.createField(components);
    return this;
  }
  admissionType(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }
  preadmitNumber(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }
  priorPatientLocation(
    pointOfCare?: string,
    room?: string,
    bed?: string,
    facility?: string,
  ): this {
    const components = [];
    if (pointOfCare) components.push(pointOfCare);
    if (room) components.push(room);
    if (bed) components.push(bed);
    if (facility) components.push(facility);

    this.fields[5] = this.createField(components);
    return this;
  }
  attendingDoctor(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[6] = this.createField(components);
    return this;
  }
  referringDoctor(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[7] = this.createField(components);
    return this;
  }
  consultingDoctor(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[8] = this.createField(components);
    return this;
  }
  hospitalService(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }
  temporaryLocation(pointOfCare?: string, room?: string, bed?: string): this {
    const components = [];
    if (pointOfCare) components.push(pointOfCare);
    if (room) components.push(room);
    if (bed) components.push(bed);

    this.fields[10] = this.createField(components);
    return this;
  }
  admitDateTime(value: string): this {
    this.fields[44] = this.createField(value);
    return this;
  }
  dischargeDateTime(value: string): this {
    this.fields[45] = this.createField(value);
    return this;
  }
}
