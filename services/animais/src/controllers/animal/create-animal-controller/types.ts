type CreateAnimalBaseBody = {
  tipo: string
  nome: string
}

type CreatePurchasedAnimalBody = CreateAnimalBaseBody & {
  origem: 'comprado'
  valorCompra: number
  dataCompra: string
  dataNascimento?: never
  maeId?: never
  paiId?: never
}

type CreateBornAnimalBody = CreateAnimalBaseBody & {
  origem: 'nascido'
  dataNascimento: string
  valorCompra?: never
  dataCompra?: never
  maeId: number
  paiId?: number | undefined
}

export type CreateAnimalBody = CreatePurchasedAnimalBody | CreateBornAnimalBody
