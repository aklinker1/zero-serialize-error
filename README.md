<div align="center">

# `@aklinker1/zero-serialize-error`

[![JSR](https://jsr.io/badges/@aklinker1/zero-serialize-error)](https://jsr.io/@aklinker1/zero-serialize-error) [![NPM Version](https://img.shields.io/npm/v/%40aklinker1%2Fzero-serialize-error?logo=npm&labelColor=red&color=white)](https://www.npmjs.com/package/@aklinker1/zero-serialize-error) [![Docs](https://img.shields.io/badge/Docs-blue?logo=readme&logoColor=white)](https://jsr.io/@aklinker1/zero-serialize-error) [![API Reference](https://img.shields.io/badge/API%20Reference-blue?logo=readme&logoColor=white)](https://jsr.io/@aklinker1/zero-serialize-error/doc) [![License](https://img.shields.io/npm/l/%40aklinker1%2Fzero-serialize-error)](https://github.com/aklinker1/zero-serialize-error/blob/main/LICENSE)

Serialize and deserialize errors with zero dependencies.

</div>

```sh
bun add @aklinker1/zero-serialize-error
```

## Features

- Convert errors to and from JS objects
- Serializes entire `cause` tree
- Supports custom properties added to errors
- Accepts custom serialization functions for converting other data types to and from objects`

## Usage

```ts
const error = Error("🐛");

const serialized = serializeError(error);
console.log(serialized); // { name: "Error", message: "🐛", stack: "..." }

const deserialized = deserializeError(serialized);
console.log(deserialized); // Error: 🐛
```

### Other Data Types

No other classes other than `Error`s are supported by default when serializing/deserializing:

```ts
const error = new Error("With a date");
error.time = new Date();

const serialized = serializeError(error);
console.log(serialized); // { ..., time: "[object Date]" }

const deserialized = deserializeError(serialized);
console.log(deserialized.time); // "[object Date]"
```

---

Inspired by `serialize-error`. Goal was to trim it down, drop any dependencies, and make it as small as possible.

| Package                           | Size  | `node_modules` Size |
| --------------------------------- | :---: | :-----------------: |
| `serialize-error`                 | 20 kB |      586.8 kB       |
| `@aklinker1/zero-serialize-error` | ?? kB |        ?? kB        |
