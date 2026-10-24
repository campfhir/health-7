import { MessageSchema } from "../../../src/types/schema";

export const ORU_R01_SCHEMA: MessageSchema = {
  messageType: "ORU",
  triggerEvent: "R01",
  version: "2.3",
  structure: [
    { name: "MSH", required: true, repeating: false },
    {
      name: "PATIENT_RESULT",
      required: true,
      repeating: true,
      segments: [
        {
          name: "PATIENT",
          required: false,
          repeating: false,
          segments: [
            { name: "PID", required: true, repeating: false },
            { name: "PD1", required: false, repeating: false },
            { name: "NK1", required: false, repeating: true },
            { name: "NTE", required: false, repeating: true },
            { name: "PV1", required: false, repeating: false },
          ],
        },
        {
          name: "ORDER_OBSERVATION",
          required: true,
          repeating: true,
          segments: [
            { name: "ORC", required: false, repeating: false },
            { name: "OBR", required: true, repeating: false },
            { name: "NTE", required: false, repeating: true },
            { name: "OBX", required: false, repeating: true },
          ],
        },
      ],
    },
  ],
};
