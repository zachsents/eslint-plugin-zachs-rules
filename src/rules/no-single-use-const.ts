import { ESLintUtils, AST_NODE_TYPES, TSESLint } from "@typescript-eslint/utils"

type Options = [
  {
    ignoreDestructuring?: boolean
    ignoreExports?: boolean
  }?,
]

type MessageIds = "singleUseConst"

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/zachsents/eslint-plugin-zachs-rules#${name}`,
)

function isExported(
  node: TSESLint.Scope.Definitions.VariableDefinition["parent"],
) {
  return (
    node.parent.type === AST_NODE_TYPES.ExportNamedDeclaration ||
    node.parent.type === AST_NODE_TYPES.ExportDefaultDeclaration
  )
}

function isSimpleConstDefinition(
  variable: TSESLint.Scope.Variable,
  ignoreExports: boolean,
  ignoreDestructuring: boolean,
) {
  const def = variable.defs.at(0)

  if (!def || def.type !== TSESLint.Scope.DefinitionType.Variable) return false

  const declaration = def.parent
  const declarator = def.node

  if (declaration.kind !== "const" || declaration.declare) return false
  if (ignoreExports && isExported(declaration)) return false
  if (ignoreDestructuring && declarator.id.type !== AST_NODE_TYPES.Identifier) {
    return false
  }

  return true
}

function hasNonInitializerWrite(variable: TSESLint.Scope.Variable) {
  return variable.references.some(
    (reference) => reference.isWrite() && reference.init !== true,
  )
}

export default createRule<Options, MessageIds>({
  name: "no-single-use-const",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Report const variables that are read exactly once and can often be inlined",
    },
    schema: [
      {
        type: "object",
        properties: {
          ignoreDestructuring: {
            type: "boolean",
          },
          ignoreExports: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      singleUseConst:
        "`{{name}}` is a const that is only used once. Consider inlining it.",
    },
  },
  defaultOptions: [{ ignoreDestructuring: true, ignoreExports: true }],
  create(context, [options]) {
    const ignoreDestructuring = options?.ignoreDestructuring ?? true
    const ignoreExports = options?.ignoreExports ?? true

    function checkScope(scope: TSESLint.Scope.Scope) {
      for (const variable of scope.variables) {
        if (
          !isSimpleConstDefinition(
            variable,
            ignoreExports,
            ignoreDestructuring,
          ) ||
          hasNonInitializerWrite(variable)
        ) {
          continue
        }

        const readReferences = variable.references.filter((reference) =>
          reference.isRead(),
        )
        const definition = variable.defs.at(0)

        if (readReferences.length === 1 && definition) {
          context.report({
            node: definition.name,
            messageId: "singleUseConst",
            data: {
              name: variable.name,
            },
          })
        }
      }

      for (const childScope of scope.childScopes) {
        checkScope(childScope)
      }
    }

    return {
      "Program:exit"() {
        const globalScope = context.sourceCode.scopeManager?.globalScope

        if (globalScope) {
          checkScope(globalScope)
        }
      },
    }
  },
})
