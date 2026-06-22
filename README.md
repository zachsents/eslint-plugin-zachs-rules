# eslint-plugin-object-map

Type-aware ESLint rules for object literals that repeatedly map same-name
properties from a source object.

```ts
return {
  createdAt: deployment.createdAt,
  id: deployment.id,
  projectId: deployment.projectId,
  status: deployment.status,
  workflows: syncedWorkflows,
}
```

If TypeScript proves those mapped keys are the complete known shape of
`deployment`, the plugin recommends a spread. If TypeScript proves `deployment`
has additional known keys, it recommends a `pick` utility such as Remeda's
`pick`.

## Rules

- `object-map/prefer-object-spread-for-exact-object-map`

  - Reports repeated same-name property maps when the mapped keys exactly match
    the source object's known properties.
  - Recommendation: `{ ...deployment }`.

- `object-map/prefer-pick-for-object-subset-map`
  - Reports repeated same-name property maps when the mapped keys are a subset
    of the source object's known properties, or the source has an index
    signature.
  - Recommendation: `pick(deployment, ["createdAt", "id", "projectId", "status"])`.

Both rules intentionally skip renamed properties, computed properties,
already-spread objects, single-property mappings, unions, and unknown-like
source types.

## Usage

```ts
// eslint.config.ts
import objectMap from "eslint-plugin-object-map"
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
      "object-map": objectMap,
    },
    rules: {
      "object-map/prefer-object-spread-for-exact-object-map": "warn",
      "object-map/prefer-pick-for-object-subset-map": "warn",
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
