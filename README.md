# eslint-plugin-zachs-rules

A small set of custom ESLint rules.

## Rules

- `zachs-rules/no-single-use-const`

  - Reports `const` variables that are read exactly once and can often be
    inlined.
  - Skips exports, destructuring, `declare const`, and variables with
    non-initializer writes.

- `zachs-rules/prefer-object-spread-for-exact-object-map`

  - Reports repeated same-name property maps when TypeScript proves the mapped
    keys exactly match the source object's known properties.
  - Recommendation: `{ ...deployment }`.

- `zachs-rules/prefer-pick-for-object-subset-map`
  - Reports repeated same-name property maps when TypeScript proves the mapped
    keys are a subset of the source object's known properties, or the source has
    an index signature.
  - Recommendation: `pick(deployment, ["createdAt", "id", "projectId", "status"])`.

The object-map rules intentionally skip renamed properties, computed
properties, already-spread objects, single-property mappings, unions, and
unknown-like source types.

## Usage

```ts
// eslint.config.ts
import zachsRules from "eslint-plugin-zachs-rules"
import parser from "@typescript-eslint/parser"

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "zachs-rules": zachsRules,
    },
    rules: {
      "zachs-rules/no-single-use-const": "warn",
      "zachs-rules/prefer-object-spread-for-exact-object-map": "warn",
      "zachs-rules/prefer-pick-for-object-subset-map": "warn",
    },
  },
]
```

## Development

```sh
bun install
bun run check
```

The package uses Bun, Prettier, oxlint with type-aware linting, and zshy for
build output.
