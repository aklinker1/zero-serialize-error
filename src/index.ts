/** Serialized error objects include */
export type SerializedError = {
  /** The `error.name` */
  name: string;
  /** The `error.message` */
  message: string;
  /** The `error.stack` */
  stack: string;
  /** The `error.cause` */
  cause?: unknown;
  [otherKeys: string]: unknown;
};

const TYPEOF_STRING = "string";
const TYPEOF_OBJECT = "object";

const NAME_KEY = "name";
const MESSAGE_KEY = "message";
const STACK_KEY = "stack";
const CAUSE_KEY = "cause";

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
export function serializeError(error: unknown | Error): unknown {
  if (typeof error !== TYPEOF_OBJECT || error == null) return error;

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack ?? "",
      ...(error.cause ? { cause: serializeError(error.cause) } : {}),
      // This spreads all custom properties onto the object, ignoring the basic error properties
      ...(serializeError({ ...error }) as any),
    };
  }

  if (Array.isArray(error)) {
    const res: any[] = [];
    for (const item of error) res.push(serializeError(item));
    return res;
  }

  const res: any = Object.create(null);
  for (const [key, value] of Object.entries(error)) {
    res[key] = serializeError(value);
  }
  return res;
}

/**
 * Deserialize a JS object into an error. When the value is not a serialized error, it recursively
 * deserializes any errors it finds in the object.
 */
export function deserializeError(obj: SerializedError): Error;
export function deserializeError(obj: unknown): unknown;
export function deserializeError(obj: unknown | SerializedError): unknown {
  if (isSerializedError(obj)) {
    const error = Error(
      obj.message,
      obj.cause ? { cause: deserializeError(obj.cause) } : undefined,
    );
    error.name = obj.name;
    error.stack = obj.stack;
    for (const [key, value] of Object.entries(obj)) {
      if (key !== NAME_KEY && key !== MESSAGE_KEY && key !== STACK_KEY && key !== CAUSE_KEY) {
        (error as any)[key] = value;
      }
    }
    return error;
  }

  if (obj == null || typeof obj !== TYPEOF_OBJECT) return obj;

  if (Array.isArray(obj)) {
    const res: any[] = [];
    for (const item of obj) res.push(deserializeError(item));
    return res;
  }

  const res: any = Object.create(null);
  for (const [key, value] of Object.entries(obj)) {
    res[key] = deserializeError(value);
  }
  return res;
}
