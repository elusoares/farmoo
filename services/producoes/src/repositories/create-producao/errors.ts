export class ProducaoCreationError extends Error {
  readonly code = 'PRODUCAO_CREATION_FAILED'

  constructor(message: string) {
    super(message)
    this.name = 'ProducaoCreationError'
  }
}
