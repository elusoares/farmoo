const getAnimalByIdValidation = (data: unknown): { id: string } => {
  if (!data || typeof data !== 'object' || !('id' in data)) {
    throw new Error('Invalid data')
  }

  return { id: String((data as any).id) }
}

export default getAnimalByIdValidation