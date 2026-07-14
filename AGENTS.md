# Repo Conventions

- Prefer implementing new custom rules as oxlint JS plugin rules when oxlint exposes the required syntax, comment, scope, or source-code APIs.
- Use ESLint rules when the rule needs TypeScript type checker data, `@typescript-eslint` parser services, or another API that oxlint JS plugins do not expose yet.
- Keep both surfaces in this package unless there is a strong reason to split publishing: ESLint rules under the main export, oxlint rules under `eslint-plugin-zachs-rules/oxlint`.
