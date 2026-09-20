export class AnimalNotFoundError extends Error {
  readonly code = 'ANIMAL_NOT_FOUND'
  
  constructor(message: string) {
    super(message)
    this.name = 'AnimalNotFoundError'
  }
}