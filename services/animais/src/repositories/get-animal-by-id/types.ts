export type AnimalView = {
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
  status: 'ativo' | 'vendido'
}
