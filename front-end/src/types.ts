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

export type Producao = {
  id: number
  animal_id: number
  nome_animal: string
  tipo_animal: string
  tipo: string
  quantidade: string
  unidade: string
  data: string
  vendido: boolean
  valor_venda: string | null
  data_venda: string | null
  status: 'vendido' | 'em estoque'
}

export type EstoqueProducao = {
  produto: string
  unidade: string
  quantidade_produzida: string
  quantidade_vendida: string
  quantidade_disponivel: string
}

export type CreateProducaoPayload = {
  animalId: number
  tipo: string
  quantidade: number
  unidade: string
  data: string
}

export type SellProducaoPayload = {
  valorVenda: number
  dataVenda: string
}

export type Custo = {
  id: number
  tipo: string
  descricao: string | null
  valor: string
  data: string
  animal_id: number | null
  nome_animal: string | null
  escopo: 'geral' | 'especifico'
}

export type CreateCustoPayload = {
  tipo: string
  descricao?: string
  valor: number
  data: string
  animalId?: number
}

export type Venda = {
  id: number
  produto: string
  quantidade: string
  preco_unitario: string
  valor_total: string
  data: string
}

export type ResultadoPorAnimal = {
  animal_id: number
  nome_animal: string
  tipo_animal: string
  total_custos: string
  total_vendas: string
  resultado: string
  situacao: 'lucro' | 'prejuizo' | 'neutro'
}