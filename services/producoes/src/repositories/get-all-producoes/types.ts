export type ProducaoView = {
  id: number
  animal_id: number
  nome_animal: string
  tipo_animal: string
  tipo: string
  quantidade: string
  unidade: string
  data: Date
  vendido: boolean
  valor_venda: number
  data_venda: Date
  status: 'vendido' | 'em estoque'
}