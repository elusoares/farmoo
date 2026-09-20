export class AnimalCreationError extends Error {
  readonly code = 'ANIMAL_CREATION_FAILED'

  constructor(message: string) {
    super(message)
    this.name = 'AnimalCreationError'
  }
}
