export class EmptyProducaoUpdateError extends Error {
  readonly code = 'EMPTY_PRODUCAO_UPDATE'

  constructor(message: string) {
    super(message)
    this.name = 'EmptyProducaoUpdateError'
  }
}

export class ProducaoUpdateNotFoundError extends Error {
  readonly code = 'PRODUCAO_UPDATE_NOT_FOUND'

  constructor(message: string) {
    super(message)
    this.name = 'ProducaoUpdateNotFoundError'
  }
}
