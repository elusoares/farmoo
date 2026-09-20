import { Animal } from '@repositories/create-animal/types'

export type UpdateAnimalData = {
  id: number
  tipo?: string
  nome?: string
  origem?: 'comprado' | 'nascido'
  valorCompra?: number | null
  dataCompra?: Date | null
  dataNascimento?: Date | null
  maeId?: number | null
  paiId?: number | null
  vendido?: boolean
  valorVenda?: number | null
  dataVenda?: Date | null
}

export type UpdatedAnimal = Animal
