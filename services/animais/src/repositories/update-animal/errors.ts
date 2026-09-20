export class EmptyAnimalUpdateError extends Error {
  readonly code = 'EMPTY_ANIMAL_UPDATE'

  constructor(message: string) {
    super(message)
    this.name = 'EmptyAnimalUpdateError'
  }
}

export class AnimalUpdateNotFoundError extends Error {
  readonly code = 'ANIMAL_UPDATE_NOT_FOUND'

  constructor(message: string) {
    super(message)
    this.name = 'AnimalUpdateNotFoundError'
  }
}
