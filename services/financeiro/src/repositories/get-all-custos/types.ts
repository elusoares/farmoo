export type CustoView = {
  id: number
  tipo: string
  descricao: string | null
  valor: string
  data: Date
  animal_id: number | null
  nome_animal: string | null
  escopo: 'geral' | 'especifico'
}
