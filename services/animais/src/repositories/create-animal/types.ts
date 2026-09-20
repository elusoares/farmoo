export type Animal = {
  id: number
  tipo: string
  nome: string
  origem: 'comprado' | 'nascido'
  valor_compra: string | null
  data_compra: Date | null
  data_nascimento: Date | null
  mae_id: number | null
  pai_id: number | null
  vendido: boolean
  valor_venda: string | null
  data_venda: Date | null
  created_at: Date
  updated_at: Date
}

type CreateAnimalBase = {
  tipo: string
  nome: string
  maeId?: number | null
  paiId?: number | null
}

type CreatePurchasedAnimalData = CreateAnimalBase & {
  origem: 'comprado'
  valorCompra: number
  dataCompra: Date
  dataNascimento?: never
}

type CreateBornAnimalData = CreateAnimalBase & {
  origem: 'nascido'
  dataNascimento: Date
  valorCompra?: never
  dataCompra?: never
}

export type CreateAnimalData = CreatePurchasedAnimalData | CreateBornAnimalData
