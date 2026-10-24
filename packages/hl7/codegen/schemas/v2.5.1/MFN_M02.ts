import { MessageSchema } from "../../../src/types/schema";

export const MFN_M02_SCHEMA: MessageSchema = {
  messageType: "MFN",
  triggerEvent: "M02",
  version: "2.5.1",
  structure: [
    {
      name: "MSH",
      required: true,
      repeating: false,
    },
    {
      name: "MFI",
      required: true,
      repeating: false,
    },
    {
      name: "MF_STAFF",
      required: true,
      repeating: true,
      segments: [
        {
          name: "MFE",
          required: true,
          repeating: false,
        },
        {
          name: "STF",
          required: true,
          repeating: false,
        },
        {
          name: "PRA",
          required: false,
          repeating: false,
        },
      ],
    },
  ],
};
