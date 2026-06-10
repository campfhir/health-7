import { ParserUtils } from "../types/parser.ts";
import { DEFAULT_ENCODING, type EncodingCharacters } from "../types/encoding.ts";

/** Path Components. */
export interface PathComponents {
  /** The segment name value. */
  segmentName: string;
  /** The field index value. */
  fieldIndex?: number;
  /** The component index value. */
  componentIndex?: number;
  /** The sub component index value. */
  subComponentIndex?: number;
}

/** Parse Path. */
export function parsePath(path: string): PathComponents | null {
  if (!path || path.trim().length === 0) {
    return null;
  }

  const parts = path.split("-");
  const segmentName = parts[0].trim().toUpperCase();

  if (!segmentName.match(/^[A-Z]{2,3}$/)) {
    return null;
  }

  const result: PathComponents = { segmentName };

  if (parts.length === 1) {
    return result;
  }

  const fieldPath = parts[1];
  const componentParts = fieldPath.split(".");

  const fieldIndex = parseInt(componentParts[0], 10);
  if (isNaN(fieldIndex) || fieldIndex < 1) {
    return null;
  }
  result.fieldIndex = fieldIndex;

  if (componentParts.length > 1) {
    const componentIndex = parseInt(componentParts[1], 10);
    if (isNaN(componentIndex) || componentIndex < 1) {
      return null;
    }
    result.componentIndex = componentIndex;
  }

  if (componentParts.length > 2) {
    const subComponentIndex = parseInt(componentParts[2], 10);
    if (isNaN(subComponentIndex) || subComponentIndex < 1) {
      return null;
    }
    result.subComponentIndex = subComponentIndex;
  }

  return result;
}

/** Value Extractor. */
export class ValueExtractor {
  private encoding: EncodingCharacters;

  /** Constructor. */
  constructor(encoding: EncodingCharacters = DEFAULT_ENCODING) {
    this.encoding = encoding;
  }

  /** Get. */
  get(path: string, message: string): string | string[] | null {
    const pathComponents = parsePath(path);
    if (!pathComponents) {
      return null;
    }

    const segments = this.findSegments(message, pathComponents.segmentName);
    if (segments.length === 0) {
      return null;
    }

    // If only segment name is specified, return the segment(s)
    if (pathComponents.fieldIndex === undefined) {
      return segments.length === 1 ? segments[0] : segments;
    }

    // Extract values from all matching segments
    const values: string[] = [];
    for (const segmentStr of segments) {
      const value = this.extractFromSegment(segmentStr, pathComponents);
      if (value !== null) {
        values.push(value);
      }
    }

    if (values.length === 0) {
      return null;
    }

    return values.length === 1 ? values[0] : values;
  }

  /**
   * Find all segments with the given name in the message.
   *
   * @param message The HL7 message string
   * @param segmentName The segment name to find
   * @returns Array of segment strings
   */
  private findSegments(message: string, segmentName: string): string[] {
    // Handle both \r and \n as segment separators
    const segments = message
      .split(/\r\n|\r|\n/)
      .filter((s) => s.trim().length > 0);
    return segments.filter((seg) =>
      seg.startsWith(segmentName + this.encoding.fieldSeparator),
    );
  }

  /**
   * Extract a value from a single segment using the path components.
   *
   * @param segmentStr The segment string
   * @param pathComponents The path components
   * @returns The extracted value or null
   */
  private extractFromSegment(
    segmentStr: string,
    pathComponents: PathComponents,
  ): string | null {
    const fields = segmentStr.split(this.encoding.fieldSeparator);

    // Field index in the path is 1-based HL7 field numbers
    // fields[0] = segment name
    // For MSH: MSH-1 is the field separator (not in fields array)
    //          MSH-2 = fields[1] (^~\&), MSH-3 = fields[2] (sending app), etc.
    //          So: fields[path_index - 1] for MSH
    // For others: PID-1 = fields[1], PID-5 = fields[5]
    //          So: fields[path_index] for non-MSH
    let fieldIndex: number;
    if (pathComponents.segmentName === "MSH") {
      // MSH-3 becomes fields[3-1] = fields[2]
      fieldIndex = pathComponents.fieldIndex! - 1;
    } else {
      // PID-5 becomes fields[5]
      fieldIndex = pathComponents.fieldIndex!;
    }

    if (fieldIndex >= fields.length) {
      return null;
    }

    const fieldValue = fields[fieldIndex];

    // If no component specified, return the entire field
    if (pathComponents.componentIndex === undefined) {
      return fieldValue;
    }

    // Parse the field to extract component
    const field = ParserUtils.parseField(fieldValue, this.encoding);

    const componentIndex = pathComponents.componentIndex - 1; // Convert to 0-based
    if (componentIndex >= field.components.length) {
      return null;
    }

    // If no subcomponent specified, return the component
    if (pathComponents.subComponentIndex === undefined) {
      return field.components[componentIndex].subComponents.join(
        this.encoding.subComponentSeparator,
      );
    }

    // Extract subcomponent
    const subComponentIndex = pathComponents.subComponentIndex - 1; // Convert to 0-based
    const component = field.components[componentIndex];

    if (subComponentIndex >= component.subComponents.length) {
      return null;
    }

    return component.subComponents[subComponentIndex];
  }

  /**
   * Create a new ValueExtractor with custom encoding.
   *
   * @param encoding Custom encoding characters
   * @returns A new ValueExtractor instance
   */
  static withEncoding(encoding: EncodingCharacters): ValueExtractor {
    return new ValueExtractor(encoding);
  }
}

/**
 * Default value extractor instance with standard HL7 encoding.
 */
export const defaultExtractor: ValueExtractor = new ValueExtractor();

/**
 * Convenience function to extract a value from an HL7 message.
 *
 * @param path The path to extract (e.g., 'PID-2.1')
 * @param message The HL7 message string
 * @returns The extracted value or null
 */
export function extractValue(
  path: string,
  message: string,
): string | string[] | null {
  return defaultExtractor.get(path, message);
}
