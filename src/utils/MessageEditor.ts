import type { Segment } from "../types/segment.ts";
import { type EncodingCharacters, DEFAULT_ENCODING } from "../types/encoding.ts";
import { type PathComponents, parsePath } from "./ValueExtractor.ts";

type Position = "before" | "after";
type Mode = { type: "last" } | { type: "each" } | { type: "nth"; n: number };

interface Update {
  path: PathComponents;
  value: string;
}

function updateSegmentLine(
  line: string,
  path: PathComponents,
  value: string,
  encoding: EncodingCharacters,
): string {
  const fields = line.split(encoding.fieldSeparator);

  const fieldIndex =
    path.segmentName === "MSH" ? path.fieldIndex! - 1 : path.fieldIndex!;

  while (fields.length <= fieldIndex) fields.push("");

  if (path.componentIndex === undefined) {
    fields[fieldIndex] = value;
  } else {
    const components = fields[fieldIndex].split(encoding.componentSeparator);
    const compIdx = path.componentIndex - 1;
    while (components.length <= compIdx) components.push("");

    if (path.subComponentIndex === undefined) {
      components[compIdx] = value;
    } else {
      const subComps = components[compIdx].split(encoding.subComponentSeparator);
      const subIdx = path.subComponentIndex - 1;
      while (subComps.length <= subIdx) subComps.push("");
      subComps[subIdx] = value;
      components[compIdx] = subComps.join(encoding.subComponentSeparator);
    }

    fields[fieldIndex] = components.join(encoding.componentSeparator);
  }

  return fields.join(encoding.fieldSeparator);
}

function applyUpdates(
  lines: string[],
  updates: Update[],
  encoding: EncodingCharacters,
): string[] {
  const result = [...lines];
  for (const { path, value } of updates) {
    const prefix = path.segmentName + encoding.fieldSeparator;
    for (let i = 0; i < result.length; i++) {
      if (result[i].startsWith(prefix)) {
        result[i] = updateSegmentLine(result[i], path, value, encoding);
      }
    }
  }
  return result;
}

interface Insertion {
  segment: Segment;
  targetType: string;
  position: Position;
  mode: Mode;
}

interface Encodable {
  encode(...args: unknown[]): string;
}

function applyInsertion(
  lines: string[],
  insertion: Insertion,
  encoding: EncodingCharacters,
): string[] {
  const { segment, targetType, position, mode } = insertion;
  const segStr = segment.encode(encoding);

  if (targetType === "__END__") {
    return [...lines, segStr];
  }

  const prefix = targetType + encoding.fieldSeparator;
  const matchIndices = lines
    .map((line, i) => (line.startsWith(prefix) ? i : -1))
    .filter((i) => i !== -1);

  if (matchIndices.length === 0) return lines;

  let targets: number[];
  if (mode.type === "each") {
    targets = matchIndices;
  } else if (mode.type === "nth") {
    const idx = matchIndices[mode.n - 1];
    targets = idx !== undefined ? [idx] : [];
  } else {
    targets = [matchIndices[matchIndices.length - 1]];
  }

  // Apply in reverse order so earlier insertions don't shift later indices
  const result = [...lines];
  for (const idx of [...targets].reverse()) {
    result.splice(position === "after" ? idx + 1 : idx, 0, segStr);
  }
  return result;
}

/** Message Editor. */
export class MessageEditor {
  private insertions: Insertion[] = [];
  private updates: Update[] = [];

  /** Constructor. */
  constructor(
    private message: Encodable,
    private encoding: EncodingCharacters = DEFAULT_ENCODING,
  ) {}

  /** Sets the update field (chainable). */
  update(path: string, value: string): this;
  /** Sets the update field (chainable). */
  update(updates: Record<string, string>): this;
  update(pathOrMap: string | Record<string, string>, value?: string): this {
    if (typeof pathOrMap === "string") {
      const parsed = parsePath(pathOrMap);
      if (parsed?.fieldIndex !== undefined) {
        this.updates.push({ path: parsed, value: value! });
      }
    } else {
      for (const [p, v] of Object.entries(pathOrMap)) {
        const parsed = parsePath(p);
        if (parsed?.fieldIndex !== undefined) {
          this.updates.push({ path: parsed, value: v });
        }
      }
    }
    return this;
  }

  /** Insert. */
  insert(segment: Segment): InsertionBuilder {
    return new InsertionBuilder(segment, this);
  }

  /** Sets the append field (chainable). */
  append(segment: Segment): this {
    this.insertions.push({
      segment,
      targetType: "__END__",
      position: "after",
      mode: { type: "last" },
    });
    return this;
  }

  /** @internal */
  _addInsertion(insertion: Insertion): this {
    this.insertions.push(insertion);
    return this;
  }

  /** Encodes this message to its HL7 wire string. */
  encode(...args: unknown[]): string {
    let lines = this.message.encode(...args).split("\r");
    lines = applyUpdates(lines, this.updates, this.encoding);
    for (const insertion of this.insertions) {
      lines = applyInsertion(lines, insertion, this.encoding);
    }
    return lines.join("\r");
  }
}

/** Insertion Builder. */
export class InsertionBuilder {
  /** Constructor. */
  constructor(
    private segment: Segment,
    private editor: MessageEditor,
  ) {}

  /** After. */
  after(targetType: string): PositionedInsertionBuilder {
    return new PositionedInsertionBuilder(
      this.segment,
      "after",
      targetType,
      this.editor,
    );
  }

  /** Before. */
  before(targetType: string): PositionedInsertionBuilder {
    return new PositionedInsertionBuilder(
      this.segment,
      "before",
      targetType,
      this.editor,
    );
  }
}

/** Positioned Insertion Builder. */
export class PositionedInsertionBuilder {
  private mode: Mode = { type: "last" };

  /** Constructor. */
  constructor(
    private segment: Segment,
    private position: Position,
    private targetType: string,
    private editor: MessageEditor,
  ) {}

  /** Sets the last field (chainable). */
  last(): this {
    this.mode = { type: "last" };
    return this;
  }

  /** Sets the each field (chainable). */
  each(): this {
    this.mode = { type: "each" };
    return this;
  }

  /** Sets the nth field (chainable). */
  nth(n: number): this {
    this.mode = { type: "nth", n };
    return this;
  }

  /** Commit. */
  commit(): MessageEditor {
    return this.editor._addInsertion({
      segment: this.segment,
      targetType: this.targetType,
      position: this.position,
      mode: this.mode,
    });
  }
}
