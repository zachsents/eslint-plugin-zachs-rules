import { expect, test } from "bun:test"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { ESLint } from "eslint"
import parser from "@typescript-eslint/parser"
import plugin from "../src/index"

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)))
// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- @typescript-eslint rule modules are runtime-compatible with ESLint plugin objects, but their generic rule types do not line up exactly.
const eslintPlugin = plugin as unknown as ESLint.Plugin

test("classifies same-name object maps by source type shape", async () => {
  const eslint = new ESLint({
    cwd: root,
    overrideConfigFile: true,
    overrideConfig: [
      {
        files: ["fixtures/**/*.ts"],
        languageOptions: {
          parser,
          parserOptions: {
            projectService: true,
            tsconfigRootDir: root,
          },
        },
        plugins: {
          "object-map": eslintPlugin,
        },
        rules: {
          "object-map/prefer-object-spread-for-exact-object-map": "error",
          "object-map/prefer-pick-for-object-subset-map": "error",
        },
      },
    ],
  })

  const results = await eslint.lintFiles(["fixtures/**/*.ts"])

  const customMessages = results
    .flatMap((result) =>
      result.messages
        .filter((message) => message.ruleId?.startsWith("object-map/"))
        .map((message) => ({
          file: path.relative(root, result.filePath),
          ruleId: message.ruleId,
          message: message.message,
        }))
        .toSorted((left, right) => left.file.localeCompare(right.file)),
    )
    .toSorted((left, right) => left.file.localeCompare(right.file))

  expect(customMessages).toEqual([
    {
      file: "fixtures/pick.ts",
      ruleId: "object-map/prefer-pick-for-object-subset-map",
      message:
        '`deployment` is remapped by 4 identical property names but has other known properties. Prefer `pick(deployment, ["createdAt", "id", "projectId", "status"])` or equivalent.',
    },
    {
      file: "fixtures/spread.ts",
      ruleId: "object-map/prefer-object-spread-for-exact-object-map",
      message:
        "`deployment` is remapped by identical property names for all of its known properties. Prefer `{ ...deployment }`.",
    },
  ])
})
