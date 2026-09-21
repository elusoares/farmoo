export class CustoCreationError extends Error {
  readonly code: string

  constructor(message: string, code = 'CUSTO_CREATION_FAILED') {
    super(message)
    this.name = 'CustoCreationError'
    this.code = code
  }
}
