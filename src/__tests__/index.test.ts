import { describe, expect, it } from "bun:test";

import { deserializeError, isSerializedError, serializeError } from "..";

describe("Error Serialization", () => {
  describe("isSerializedError", () => {
    describe("error object", () => {
      const obj = {
        name: "Error",
        message: "Test message",
        stack: "Can be anything",
      };

      it("returns true", () => {
        expect(isSerializedError(obj)).toBe(true);
      });
    });

    describe("no message", () => {
      const obj = {
        name: "Error",
        stack: "Can be anything",
      };

      it("returns false", () => {
        expect(isSerializedError(obj)).toBe(false);
      });
    });

    describe("no stack", () => {
      const obj = {
        name: "Error",
        message: "Test message",
      };

      it("returns false", () => {
        expect(isSerializedError(obj)).toBe(false);
      });
    });

    describe("no name", () => {
      const obj = {
        message: "Test message",
        stack: "Can be anything",
      };

      it("returns false", () => {
        expect(isSerializedError(obj)).toBe(false);
      });
    });
  });

  describe("serializeError/deserializeError", () => {
    describe("error", () => {
      const error = Error("test");
      const expected = {
        name: "Error",
        message: "test",
        stack: expect.any(String),
      };

      it("should serialize the error to an object", () => {
        const serialized = serializeError(error);
        expect(serialized).toEqual(expected);
        expect(deserializeError(serialized)).toEqual(error);
      });
    });

    describe("error with cause chain", () => {
      const error = Error("one", { cause: Error("two", { cause: Error("three") }) });
      const expected = {
        name: "Error",
        message: "one",
        stack: expect.any(String),
        cause: {
          name: "Error",
          message: "two",
          stack: expect.any(String),
          cause: {
            name: "Error",
            message: "three",
            stack: expect.any(String),
          },
        },
      };

      it("should serialize the error to an object", () => {
        const serialized = serializeError(error);
        expect(serialized).toEqual(expected);
        expect(deserializeError(serialized)).toEqual(error);
      });
    });

    describe("error with custom properties", () => {
      const error: any = Error("test");
      error.custom = 123;
      const expected = {
        name: "Error",
        message: "test",
        stack: expect.any(String),
        custom: 123,
      };

      it("should serialize the error to an object", () => {
        const serialized = serializeError(error);
        expect(serialized).toEqual(expected);
        expect(deserializeError(serialized)).toEqual(error);
      });
    });

    describe("custom error class", () => {
      class FetchError extends Error {
        constructor(
          readonly response: Response,
          options?: ErrorOptions,
        ) {
          super(`Failed to fetch: ${response.status}`, options);
          this.name = "FetchError";
        }
      }
      const input = new FetchError(new Response(undefined, { status: 404 }));

      const expected = {
        name: "FetchError",
        message: "Failed to fetch: 404",
        stack: expect.any(String),
        response: {},
      };

      const expectedDeserialized = Error(input.message);
      expectedDeserialized.stack = input.stack;
      expectedDeserialized.name = input.name;
      (expectedDeserialized as any).response = {};

      it("should serialize the error to an object", () => {
        const serialized = serializeError(input);
        expect(serialized).toEqual(expected);
        const deserialized = deserializeError(serialized);
        console.log({
          deserialized: Object.entries(deserialized),
          expectedDeserialized: Object.entries(expectedDeserialized),
        });
        expect(deserialized).toEqual(expectedDeserialized);
        expect(deserialized).not.toBeInstanceOf(FetchError);
      });
    });

    describe("nested error", () => {
      const error = {
        test: Error("message"),
      };
      const expected = {
        test: {
          name: "Error",
          message: "message",
          stack: expect.any(String),
        },
      };

      it("should serialize/deserialize the entire object", () => {
        const serialized = serializeError(error);
        expect(serialized).toEqual(expected);
        expect(deserializeError(serialized)).toEqual(error);
      });
    });
  });
});
