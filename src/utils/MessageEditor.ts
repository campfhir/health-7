import { Segment } from "../types/segment";
import { EncodingCharacters, DEFAULT_ENCODING } from "../types/encoding";

type Position = "before" | "after";
type Mode = { type: "last" } | { type: "each" } | { type: "nth"; n: number };

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

export class MessageEditor {
  private insertions: Insertion[] = [];

  constructor(
    private message: Encodable,
    private encoding: EncodingCharacters = DEFAULT_ENCODING,
  ) {}

  insert(segment: Segment): InsertionBuilder {
    return new InsertionBuilder(segment, this);
  }

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

  encode(...args: unknown[]): string {
    let lines = this.message.encode(...args).split("\r");
    for (const insertion of this.insertions) {
      lines = applyInsertion(lines, insertion, this.encoding);
    }
    return lines.join("\r");
  }
}

export class InsertionBuilder {
  constructor(
    private segment: Segment,
    private editor: MessageEditor,
  ) {}

  after(targetType: string): PositionedInsertionBuilder {
    return new PositionedInsertionBuilder(
      this.segment,
      "after",
      targetType,
      this.editor,
    );
  }

  before(targetType: string): PositionedInsertionBuilder {
    return new PositionedInsertionBuilder(
      this.segment,
      "before",
      targetType,
      this.editor,
    );
  }
}

export class PositionedInsertionBuilder {
  private mode: Mode = { type: "last" };

  constructor(
    private segment: Segment,
    private position: Position,
    private targetType: string,
    private editor: MessageEditor,
  ) {}

  last(): this {
    this.mode = { type: "last" };
    return this;
  }

  each(): this {
    this.mode = { type: "each" };
    return this;
  }

  nth(n: number): this {
    this.mode = { type: "nth", n };
    return this;
  }

  commit(): MessageEditor {
    return this.editor._addInsertion({
      segment: this.segment,
      targetType: this.targetType,
      position: this.position,
      mode: this.mode,
    });
  }
}
