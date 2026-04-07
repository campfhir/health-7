import { MessageSchema } from '../../../src/types/schema';

/**
 * ORU^R30 - Unsolicited Point-Of-Care Observation Message Without Existing Order
 * Also used for R31 and R32 trigger events (same structure, different business rules)
 *
 * R30: Place an order based on observation
 * R31: Search for an order
 * R32: Pre-ordered observation
 */
export const ORU_R30_SCHEMA: MessageSchema = {
  messageType: 'ORU',
  triggerEvent: 'R30',
  version: '2.5.1',
  structure: [
    {
      name: 'MSH',
      required: true,
      repeating: false,
    },
    {
      name: 'PATIENT_RESULT',
      required: true,
      repeating: true,
      segments: [
        {
          name: 'PATIENT',
          required: false,
          repeating: false,
          segments: [
            {
              name: 'PID',
              required: true,
              repeating: false,
            },
            {
              name: 'PV1',
              required: false,
              repeating: false,
            },
          ],
        },
        {
          name: 'ORDER_OBSERVATION',
          required: true,
          repeating: true,
          segments: [
            {
              name: 'ORC',
              required: true,
              repeating: false,
            },
            {
              name: 'OBR',
              required: true,
              repeating: false,
            },
            {
              name: 'OBX',
              required: false,
              repeating: true,
            },
          ],
        },
      ],
    },
  ],
};

// R31 and R32 use the same structure as R30
export const ORU_R31_SCHEMA: MessageSchema = {
  ...ORU_R30_SCHEMA,
  triggerEvent: 'R31',
};

export const ORU_R32_SCHEMA: MessageSchema = {
  ...ORU_R30_SCHEMA,
  triggerEvent: 'R32',
};
