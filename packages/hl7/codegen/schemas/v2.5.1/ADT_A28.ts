import { MessageSchema } from "../../../src/types/schema";
import { ADT_A28_SCHEMA as ADT_A28_V2_3 } from "../v2.3/ADT_A28";

export const ADT_A28_SCHEMA: MessageSchema = {
  ...ADT_A28_V2_3,
  version: "2.5.1",
};
