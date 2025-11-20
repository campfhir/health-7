import { MessageSchema } from '../../types/schema';

export const ORU_R01_SCHEMA: MessageSchema = {
  messageType: 'ORU',
  triggerEvent: 'R01',
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
