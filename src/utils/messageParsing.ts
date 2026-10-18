/**
 * Helpers shared by the hand-written message parsers.
 *
 * @module
 */
import { Err } from "./err.ts";
import type { Result } from "../types/result.ts";
import type { ErrResult } from "../types/err.ts";
import type { EncodingCharacters } from "../types/encoding.ts";
import { HL7Message } from "../types/message.ts";
import type { MSH } from "../segments/v2.3/MSH.ts";

/** Splits a message into non-empty segment strings (CR, LF or CRLF delimited). */
export function splitSegments(messageString: string): string[] {
  return messageString.split(/\r\n|\r|\n/).filter((s) => s.trim().length > 0);
}

/** The pieces every parser needs once the leading MSH segment has been read. */
export interface MessageHeader<TMsh extends MSH> {
  segments: string[];
  msh: TMsh;
  encoding: EncodingCharacters;
  message: HL7Message;
}

/**
 * Splits `messageString`, parses the leading MSH with `parseMsh` and starts the
 * HL7Message container. Returns an error for an empty message or one that does
 * not start with MSH.
 */
export function readMessageHeader<TMsh extends MSH>(
  messageString: string,
  parseMsh: (s: string) => Result<TMsh>,
): Result<MessageHeader<TMsh>> {
  const segments = splitSegments(messageString);
  if (segments.length === 0) {
    return { ok: false, err: new Err("Empty message") };
  }
  if (!segments[0].startsWith("MSH")) {
    return { ok: false, err: new Err("Message must start with MSH segment") };
  }
  const mshResult = parseMsh(segments[0]);
  if (!mshResult.ok || !mshResult.val) {
    return {
      ok: false,
      err: new Err(mshResult.err?.message || "Failed to parse MSH segment"),
    };
  }
  const msh = mshResult.val as TMsh;
  const encoding = msh.getEncoding();
  const message = new HL7Message(encoding);
  message.addSegment(msh);
  return { ok: true, val: { segments, msh, encoding, message } };
}

/** Builds the error result for a segment that failed to parse. */
export function segmentParseFailure(
  segmentType: string,
  line: number,
  cause: Result<unknown>,
): ErrResult<string> {
  return {
    ok: false,
    err: new Err(
      `Failed to parse ${segmentType} segment at line ${line}: ${cause.err?.message}`,
    ) as Err<string>,
  };
}

/** Builds the error result for a segment that appears where the structure does not allow it. */
export function misplacedSegment(
  segmentType: string,
  line: number,
  reason: string,
): ErrResult<string> {
  return {
    ok: false,
    err: new Err(`${segmentType} segment at line ${line} ${reason}`),
  };
}
