import { extractValue, ValueExtractor } from '../src/index.ts';

// Sample HL7 ORU^R01 message
const sampleMessage = `MSH|^~\\&|LAB|General Hospital|EMR|Main Campus|20250119120000||ORU^R01^ORU_R01|MSG001|P|2.5.1
PID|1||12345^^^MRN^MR||Doe^John^Q^Jr^Dr||19800115|M|||123 Main St^Apt 4^Springfield^IL^62701^USA||555-1234|555-5678
PV1|1|I|ICU^101^A^Main||||1234^Smith^Jane
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^LN|||20250119120000
OBX|1|NM|718-7^Hemoglobin^LN|1|15.5|g/dL||||||F|||20250119120000
OBX|2|NM|789-8^RBC^LN|1|5.2|10*6/uL||||||F|||20250119120000
OBX|3|NM|6690-2^WBC^LN|1|7.8|10*3/uL||||||F|||20250119120000`;

console.log('='.repeat(80));
console.log('HL7 Value Extractor Examples');
console.log('='.repeat(80));
console.log();

// Example 1: Extract entire segments
console.log('1. Extract Entire Segments');
console.log('-'.repeat(80));
const mshSegment = extractValue('MSH', sampleMessage);
console.log('MSH segment:', mshSegment);
console.log();

// Example 2: Extract specific fields
console.log('2. Extract Specific Fields');
console.log('-'.repeat(80));
const sendingApp = extractValue('MSH-3', sampleMessage);
const receivingApp = extractValue('MSH-5', sampleMessage);
const messageType = extractValue('MSH-9', sampleMessage);
const version = extractValue('MSH-12', sampleMessage);

console.log('Sending Application:', sendingApp);
console.log('Receiving Application:', receivingApp);
console.log('Message Type:', messageType);
console.log('HL7 Version:', version);
console.log();

// Example 3: Extract field components
console.log('3. Extract Field Components');
console.log('-'.repeat(80));
const msgTypeCode = extractValue('MSH-9.1', sampleMessage);
const triggerEvent = extractValue('MSH-9.2', sampleMessage);
const msgStructure = extractValue('MSH-9.3', sampleMessage);

console.log('Message Type Code:', msgTypeCode);
console.log('Trigger Event:', triggerEvent);
console.log('Message Structure:', msgStructure);
console.log();

// Example 4: Extract patient information
console.log('4. Extract Patient Information');
console.log('-'.repeat(80));
const patientId = extractValue('PID-3.1', sampleMessage);
const familyName = extractValue('PID-5.1', sampleMessage);
const givenName = extractValue('PID-5.2', sampleMessage);
const middleName = extractValue('PID-5.3', sampleMessage);
const dob = extractValue('PID-7', sampleMessage);
const sex = extractValue('PID-8', sampleMessage);

console.log('Patient ID:', patientId);
console.log('Name:', `${familyName}, ${givenName} ${middleName}`);
console.log('Date of Birth:', dob);
console.log('Sex:', sex);
console.log();

// Example 5: Extract patient address
console.log('5. Extract Patient Address');
console.log('-'.repeat(80));
const street = extractValue('PID-11.1', sampleMessage);
const apt = extractValue('PID-11.2', sampleMessage);
const city = extractValue('PID-11.3', sampleMessage);
const state = extractValue('PID-11.4', sampleMessage);
const zip = extractValue('PID-11.5', sampleMessage);
const country = extractValue('PID-11.6', sampleMessage);

console.log('Address:');
console.log(`  ${street} ${apt}`);
console.log(`  ${city}, ${state} ${zip}`);
console.log(`  ${country}`);
console.log();

// Example 6: Extract phone numbers
console.log('6. Extract Contact Information');
console.log('-'.repeat(80));
const homePhone = extractValue('PID-13', sampleMessage);
const workPhone = extractValue('PID-14', sampleMessage);

console.log('Home Phone:', homePhone);
console.log('Work Phone:', workPhone);
console.log();

// Example 7: Extract repeating segments (OBX)
console.log('7. Extract Repeating Segments');
console.log('-'.repeat(80));
const obxSegments = extractValue('OBX', sampleMessage);
console.log('OBX Segments Count:', Array.isArray(obxSegments) ? obxSegments.length : 1);
if (Array.isArray(obxSegments)) {
  obxSegments.forEach((seg, i) => {
    console.log(`  OBX[${i + 1}]:`, seg.substring(0, 50) + '...');
  });
}
console.log();

// Example 8: Extract observation results
console.log('8. Extract Observation Results');
console.log('-'.repeat(80));
const obxIds = extractValue('OBX-3.1', sampleMessage);
const obxNames = extractValue('OBX-3.2', sampleMessage);
const obxValues = extractValue('OBX-5', sampleMessage);
const obxUnits = extractValue('OBX-6.1', sampleMessage);

console.log('Observation Results:');
if (Array.isArray(obxNames) && Array.isArray(obxValues) && Array.isArray(obxUnits)) {
  for (let i = 0; i < obxNames.length; i++) {
    console.log(`  ${obxNames[i]}: ${obxValues[i]} ${obxUnits[i]}`);
  }
}
console.log();

// Example 9: Handle invalid paths
console.log('9. Handle Invalid Paths');
console.log('-'.repeat(80));
const invalidSegment = extractValue('NTE', sampleMessage);
const invalidField = extractValue('PID-999', sampleMessage);
const invalidPath = extractValue('INVALID-PATH', sampleMessage);

console.log('Non-existent segment (NTE):', invalidSegment);
console.log('Invalid field index (PID-999):', invalidField);
console.log('Invalid path format:', invalidPath);
console.log();

// Example 10: Using ValueExtractor class with custom encoding
console.log('10. Custom Encoding (Advanced)');
console.log('-'.repeat(80));
const extractor = new ValueExtractor();
const result = extractor.get('PID-5.1', sampleMessage);
console.log('Using ValueExtractor class:', result);
console.log();

// Example 11: Practical use case - Extract all demographics
console.log('11. Practical Use Case: Patient Demographics Summary');
console.log('-'.repeat(80));
interface PatientDemographics {
  id: string | null;
  name: {
    family: string | null;
    given: string | null;
    middle: string | null;
  };
  dob: string | null;
  sex: string | null;
  address: {
    street: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
  };
  phone: {
    home: string | null;
    work: string | null;
  };
}

const demographics: PatientDemographics = {
  id: extractValue('PID-3.1', sampleMessage) as string | null,
  name: {
    family: extractValue('PID-5.1', sampleMessage) as string | null,
    given: extractValue('PID-5.2', sampleMessage) as string | null,
    middle: extractValue('PID-5.3', sampleMessage) as string | null,
  },
  dob: extractValue('PID-7', sampleMessage) as string | null,
  sex: extractValue('PID-8', sampleMessage) as string | null,
  address: {
    street: extractValue('PID-11.1', sampleMessage) as string | null,
    city: extractValue('PID-11.3', sampleMessage) as string | null,
    state: extractValue('PID-11.4', sampleMessage) as string | null,
    zip: extractValue('PID-11.5', sampleMessage) as string | null,
  },
  phone: {
    home: extractValue('PID-13', sampleMessage) as string | null,
    work: extractValue('PID-14', sampleMessage) as string | null,
  },
};

console.log('Patient Demographics Object:');
console.log(JSON.stringify(demographics, null, 2));
console.log();

console.log('='.repeat(80));
console.log('Examples Complete');
console.log('='.repeat(80));
