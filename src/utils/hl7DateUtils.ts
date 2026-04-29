import { dateUtils } from "./dateUtils";

export const DateLayout = "20060102";
export const DateTimeLayout = "20060102150405";
export const TimeLayout = "150405";
export const TimeWithSecondsLayout = "150405.000";
const HL7LayoutDate = "Date";
const HL7LayoutDateTime = "DateTime";
const HL7LayoutTime = "Time";
const HL7LayoutTimeWithSeconds = "TimeWithSeconds";

export type HL7DateLayout = "Date" | typeof DateLayout | (string & {});

export type HL7TimeLayout =
  | "Time"
  | "TimeWithSeconds"
  | typeof TimeLayout
  | typeof TimeWithSecondsLayout
  | (string & {});

export type HL7DateTimeLayout =
  | "DateTime"
  | typeof DateTimeLayout
  | (string & {});

/**
 * Formats a date value for use in an HL7 field.
 * Strings pass through unchanged (backwards compatible).
 * Date objects are formatted using the provided layout, defaulting to HL7DateTime.
 */
export function formatHL7Date(
  value: string | Date,
  layout: string = DateTimeLayout,
): string {
  if (typeof value === "string") return value;
  let resolved = layout;
  switch (layout) {
    case HL7LayoutDate:
      resolved = DateLayout;
      break;
    case HL7LayoutDateTime:
      resolved = DateTimeLayout;
      break;
    case HL7LayoutTime:
      resolved = TimeLayout;
      break;
    case HL7LayoutTimeWithSeconds:
      resolved = TimeWithSecondsLayout;
      break;
    default:
      break;
  }
  const result = dateUtils.format(value, resolved);
  return result.ok ? result.val : "";
}
