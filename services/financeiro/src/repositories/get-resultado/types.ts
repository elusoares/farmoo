export type ResultadoPorAnimalView = {
  animal_id: number
  nome_animal: string
  tipo_animal: string
  total_custos: string
  total_vendas: string
  resultado: string
  situacao: 'lucro' | 'prejuizo' | 'neutro'
}
