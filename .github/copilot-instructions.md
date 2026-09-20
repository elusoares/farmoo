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

#### Examples

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

#### Examples

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

### Zod Validation Files

- Each controller lives in `controllers/<name>/`.
- `index.ts` is the controller entrypoint.
- `validation.ts` contains the Zod schemas and the validation function for body, path, or query.

#### validation.ts pattern

- The validation function receives `unknown`.
- Use `safeParse` to validate against the expected Zod schema.
- On success, return the parsed data typed as an explicit, hand-written type.
- On failure, throw a validation error containing the failure details.
- Use HTTP status `400 Bad Request` for validation errors (or `422 Unprocessable Entity` if the project distinguishes malformed vs. semantic errors).

#### Error details

- The thrown error must include the Zod error details.
- Use `z.treeifyError()` or `z.prettifyError()` to expose the failure reason clearly.

#### Example

```ts
import { z } from 'zod'
import { Body } from './types'

const bodySchema: z.ZodType<Body> = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

const validateBody = (data: unknown): Body => {
  const result = bodySchema.safeParse(data)

  if (!result.success) {
    throw new ValidationError('Invalid body', {
      status: 400,
      details: z.treeifyError(result.error),
    })
  }

  return result.data
}
export default validateBody
```
### Logging

- A shared `logger` is available with `info`, `warn`, and `error` methods.
- In controllers, always log the success outcome using `logger.info`
- In the other parts of the code, log with the following levels:
  - On expected/warning conditions: `logger.warn`
  - On errors: `logger.error`
- 
- Pass a short message as the first argument and any extra details as additional arguments.

#### Error Handling
- Always handle errors with http error handler in `services/animais/src/infra/http/errors.ts`, ensuring that proper HTTP status codes and error messages are returned to the client.

### Controller Structure

- Each controller lives in `controllers/<name>/`.
- `index.ts` is the controller entrypoint.
- `types.ts` contains the type definitions for the controller.
- `validation.ts` contains the Zod schemas and the validation function for body, path, or query.
- All errors thrown within controllers should be instances of `HttpError` to ensure consistent error handling and proper HTTP responses.

#### Example
```ts
import { HttpError } from '@infra/http/errors'
import { HttpStatusCode } from '@infra/http/types'
import { AnimalCreationError } from '@repositories/errors'
import createAnimalUseCase from '@use-cases/create-animal-usecase'
import logger from '@utils/logger'
import { Request, Response } from 'express'
import createAnimalValidation from './validation'

const CreateAnimalController = async (req: Request, res: Response) => {
  logger.info('Request de criação de animal', {
    body: req.body,
  })
  const validatedBody = createAnimalValidation(req.body)
  try {
    const animal = await createAnimalUseCase(validatedBody)

    logger.info('Animal criado', { animalId: animal.id })
    return res.status(HttpStatusCode.CREATED).json(animal)
  } catch (error) {
    if (error instanceof AnimalCreationError) {
      logger.error('Erro ao criar animal', error)

      throw new HttpError('Não foi possível criar o animal', {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        details: { code: error.code },
      })
    }

    throw error
  }
}

export default CreateAnimalController
```

### Use Case Structure

- Each use case lives in `use-cases/<name>-usecase/`.
- A use case should communicate directly with the repositories layer and should not depend on controllers or HTTP details.

#### Example
```ts
import { CreateAnimalBody } from '@controllers/animal/create-animal-controller/types'
import { createAnimal } from '@repositories/create-animal'

const createAnimalUseCase = async (animalData: CreateAnimalBody) => {
  const animal = await createAnimal(
    animalData.origem === 'comprado'
      ? {
          tipo: animalData.tipo,
          nome: animalData.nome,
          origem: animalData.origem,
          valorCompra: animalData.valorCompra,
          dataCompra: new Date(animalData.dataCompra),
        }
      : {
          tipo: animalData.tipo,
          nome: animalData.nome,
          origem: animalData.origem,
          dataNascimento: new Date(animalData.dataNascimento),
          maeId: animalData.maeId,
          ...(animalData.paiId !== undefined ? { paiId: animalData.paiId } : {}),
        }
  )
  return animal
}

export default createAnimalUseCase
```

### Repository Structure
- Each repository lives in `repositories/<name>/`.
- A repository should handle direct interactions with the database and should not depend on controllers or HTTP details.
- A repository should have its own error classes to handle specific database-related errors.
- A repository should have its own types for the data it handles, such as input data and database row representations.
- A repository should not depend on the use case or controller layers; it should be reusable and independent.
- A repository should not throw generic errors; it should throw its specific error classes to allow the use case layer to handle them appropriately.
- A repository should have its own types for the data it handles, such as input data and database row representations.

#### Example
```ts
import { pool } from '@config/database'
import logger from '@utils/logger'
import { AnimalCreationError } from './errors'
import { AnimalRow, CreateAnimalData } from './types'

export const createAnimalRepository = async (data: CreateAnimalData): Promise<AnimalRow> => {
  const result = await pool.query<AnimalRow>(
    `INSERT INTO farmoo.animais (
			tipo,
			nome,
			origem,
			valor_compra,
			data_compra,
			data_nascimento,
			mae_id,
			pai_id
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING *`,
    [
      data.tipo,
      data.nome,
      data.origem,
      data.valorCompra ?? null,
      data.dataCompra ?? null,
      data.dataNascimento ?? null,
      data.maeId ?? null,
      data.paiId ?? null,
    ]
  )

  const animal = result.rows[0]

  if (!animal) {
    logger.error('Falha ao criar animal: nenhum registro retornado', {
      tipo: data.tipo,
      nome: data.nome,
    })
    throw new AnimalCreationError('O animal não foi retornado após a inserção no banco de dados')
  }

  return animal
}
```