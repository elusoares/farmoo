export type AnimalOrigin = 'comprado' | 'nascido'

export type Animal = {
  id: number
  tipo: string
  nome: string
  origem: AnimalOrigin
  valor_compra: string | null
  data_compra: string | null
  data_nascimento: string | null
  mae_id: number | null
  pai_id: number | null
  vendido: boolean
  valor_venda: string | null
  data_venda: string | null
  status: 'ativo' | 'vendido'
}

export type CreateAnimalPayload =
  | {
      tipo: string
      nome: string
      origem: 'comprado'
      valorCompra: number
      dataCompra: string
    }
  | {
      tipo: string
      nome: string
      origem: 'nascido'
      dataNascimento: string
      maeId: number
      paiId?: number
    }

export type SellAnimalPayload = {
  valorVenda: number
  dataVenda: string
}