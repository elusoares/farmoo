export type Custo = {
  id: number
  tipo: string
  descricao: string | null
  valor: string
  data: Date
  animal_id: number | null
  created_at: Date
}

export type CreateCustoData = {
  tipo: string
  descricao?: string | undefined
  valor: number
  data: Date
  animalId?: number | undefined
}
