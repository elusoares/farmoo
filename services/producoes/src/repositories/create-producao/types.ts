export type Producao = {
  id: number
  animal_id: number
  tipo: string
  quantidade: string
  unidade: string
  data: Date
  created_at: Date
}

export type CreateProducaoData = {
  animalId: number
  tipo: string
  quantidade: number
  unidade: string
  data: Date
}
