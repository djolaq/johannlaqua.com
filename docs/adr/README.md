# Architecture decision records

Short notes on structural choices: the context, the decision, what it costs.
One file per decision, numbered, never rewritten — a decision that changes
gets a new record that supersedes the old one.

| #                                          | Decision                                         | Status   |
| ------------------------------------------ | ------------------------------------------------ | -------- |
| [0001](0001-monorepo-npm-workspaces.md)    | One repository with npm workspaces               | Accepted |
| [0002](0002-design-system-as-a-package.md) | The design system is a package the site consumes | Accepted |
| [0003](0003-host-agnostic-deployment.md)   | Build once, choose the host with a variable      | Accepted |
