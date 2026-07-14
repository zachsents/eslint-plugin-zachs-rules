# eslint-plugin-zachs-rules

A small set of custom ESLint rules.

## Rules

### ESLint

- `zachs-rules/no-single-use-const`

  - Reports `const` variables that are read up to a configurable threshold and
    can often be inlined.
  - Set `{ maxUses: 2 }` to report const variables read up to two times. The
    default is `1`.
  - Skips exports, destructuring, `declare const`, and variables with
    non-initializer writes.
  - Set `{ ignoreConstantCase: true }` to skip names like `API_URL` and
    `VARS_LIKE_THIS`.

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

### Oxlint

- `zachs-rules/require-disable-directive-description`
  - Reports disable directives recognized by oxlint that do not include a
    description after `--`.

## ESLint Usage

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
      "zachs-rules/no-single-use-const": [
        "warn",
        { ignoreConstantCase: true, maxUses: 2 },
      ],
      "zachs-rules/prefer-object-spread-for-exact-object-map": "warn",
      "zachs-rules/prefer-pick-for-object-subset-map": "warn",
    },
  },
]
```

## Oxlint Usage

```json
{
  "jsPlugins": [
    {
      "name": "zachs-rules",
      "specifier": "eslint-plugin-zachs-rules/oxlint"
    }
  ],
  "rules": {
    "zachs-rules/require-disable-directive-description": "error"
  }
}
```

## Development

```sh
bun install
bun run check
```

The package uses Bun, Prettier, oxlint with type-aware linting, and zshy for
build output.
