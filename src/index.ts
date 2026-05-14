/** Serialized error objects include */
export type SerializedError = {
  name: string;
  message: string;
  stack: string;
  cause?: unknown;
  [otherKeys: string]: unknown;
};

const TYPEOF_STRING = "string";
const TYPEOF_OBJECT = "object";

/**
 * A value is considered a serialize error when it's name, message, and stack properties are all
 * strings.
 */
export function isSerializedError(value: unknown): value is SerializedError {
  return (
    value != null &&
    typeof value === TYPEOF_OBJECT &&
    typeof (value as any).name === TYPEOF_STRING &&
    typeof (value as any).message === TYPEOF_STRING &&
    typeof (value as any).stack === TYPEOF_STRING
  );
}

/**
 * Serialize an error into a JS object. When the value is not an error, it recursively serializes
 * any errors it finds in the object.
 */
export function serializeError(error: Error): SerializedError;
export function serializeError(error: unknown): unknown;
export function serializeError(_error: unknown | Error): unknown {
  throw Error("TODO");
}

/**
 * Deserialize a JS object into an error. When the value is not a serialized error, it recursively
 * deserializes any errors it finds in the object.
 */
export function deserializeError(obj: SerializedError): Error;
export function deserializeError(obj: unknown): unknown;
export function deserializeError(_obj: unknown | SerializedError): unknown {
  throw Error("TODO");
}
