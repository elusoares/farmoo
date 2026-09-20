# Copilot Instructions

## Code Style

### Strings
- Always use single quotes in JS/TS.
- Exception: use double quotes only in .json files and in JSON strings embedded in code.
- Use backticks for template literals normally.

### Semicolons
- Never use semicolons at end of lines.
- Exception: if the next line starts with `(` or `[`, insert a `;` at the end of the previous line (or a leading `;` on the line starting with `(` or `[`) to avoid ASI issues.
- Do not add `;` in imports, exports, declarations, or returns.

### Examples

Avoid:
```ts
const name = "John"
import fs from "fs"
export function greet(): string {
  return "Hello"
}
```

Prefer:
```ts
const name = 'John'
import fs from 'fs'
export function greet(): string {
  return 'Hello'
}
```

### Functions
- Always use arrow functions for both named and anonymous functions.

### Examples

Avoid:
```ts
function greet(): string {
  return 'Hello'
}
```

Prefer:
```ts
const greet = (): string => {
  return 'Hello'
}
```

## Project Style
This is a set of guidelines for the overall project style, including code structure, naming conventions, and best practices.

### Project Overview
Perfeito! Aqui está o parágrafo atualizado com o nome **Farmoo**:

---

**Project Overview:** This is an academic project for a postgraduate course in Web Development, specifically for the discipline "Desenvolvimento de Aplicações Orientadas a Serviços" (Service-Oriented Application Development). The project, named **Farmoo**, is a back-end system composed of three independent RESTful web services — **Animal Service**, **Production Service**, and **Financial Service** — each containerized with Docker and sharing a single PostgreSQL database. The system manages a small farm by tracking animals (cows, chickens, sheep, pigs, ducks), their daily production (milk, eggs, wool), sales of both production and animals, and operational costs (medicine, vaccines, feed). It calculates profit or loss per animal and for the farm as a whole. The project also includes a simple web client that consumes all three services and must be resilient to service failures (continuing to work if one service goes down and resuming automatically when it comes back), plus an AI chat interface integrated via the Model Context Protocol (MCP) that exposes tools for natural language interaction with the system using OpenAI or Google AI. Key architectural constraints: a shared database across all services with each service accessing only its own domain tables/views.

### Code Structure
This project implements partially Clean Architecture, where each service has the following folder structure:
```text
service/ # where service is the name of the specific service (e.g., animal-service, production-service, financial-service)
├── src/
│   ├── config/ # database initialization and configuration, and environment type definitions
│   ├── controllers/ # request handlers for the service
│   |   └──controler-name/ # folder for a specific controller
|   |      ├──index.ts # entry point for the controller  
|   |      ├──types.ts # type definitions for the controller
|   |      └──validation.ts # validation logic for the controller
│   ├── infra/
|   |   └── http/ # server initialization, routing and type definitions
│   ├── repositories/ # data access layer for the service and data type definitions
│   └── utils/ # utility functions
└── index.ts # entry point
```

## Zod Validation Files

- Each controller lives in `controllers/<name>/`.
- `index.ts` is the controller entrypoint.
- `validation.ts` contains the Zod schemas and the validation function for body, path, or query.

### validation.ts pattern

- The validation function receives `unknown`.
- Use `safeParse` to validate against the expected Zod schema.
- On success, return the parsed data typed as an explicit, hand-written type.
- On failure, throw a validation error containing the failure details.
- Use HTTP status `400 Bad Request` for validation errors (or `422 Unprocessable Entity` if the project distinguishes malformed vs. semantic errors).

### Error details

- The thrown error must include the Zod error details.
- Use `z.treeifyError()` or `z.prettifyError()` to expose the failure reason clearly.

### Example

```ts
import { z } from 'zod'
import { Body } from './types'

const bodySchema: z.ZodType<Body> = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

export const validateBody = (data: unknown): Body => {
  const result = bodySchema.safeParse(data)

  if (!result.success) {
    throw new ValidationError('Invalid body', {
      status: 400,
      details: z.treeifyError(result.error),
    })
  }

  return result.data
}
``` 
## Logging

- A shared `logger` is available with `info`, `warn`, and `error` methods.
- In controllers, always log the outcome using the appropriate level:
  - On success: `logger.info`
  - On expected/warning conditions: `logger.warn`
  - On errors: `logger.error`
- Pass a short message as the first argument and any extra details as additional arguments.