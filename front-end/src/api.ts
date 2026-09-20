import type {
    Animal,
    CreateAnimalPayload,
    CreateProducaoPayload,
    EstoqueProducao,
    Producao,
    SellAnimalPayload,
    SellProducaoPayload,
} from './types'

const animaisApiUrl = import.meta.env.VITE_ANIMAIS_API_URL ?? '/api/animais'
const producoesApiUrl = import.meta.env.VITE_PRODUCOES_API_URL ?? '/api/producoes'

const getErrorMessage = async (response: Response) => {
  try {
    const body = (await response.json()) as { error?: string; message?: string }
    return body.error ?? body.message ?? 'Não foi possível concluir a operação'
  } catch {
    return 'Não foi possível concluir a operação'
  }
}

const request = async <ResponseBody>(apiUrl: string, path: string, init?: RequestInit): Promise<ResponseBody> => {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  return (await response.json()) as ResponseBody
}

export const checkAnimalsHealth = async (signal?: AbortSignal) => {
  const response = await fetch(`${animaisApiUrl}/health`, { signal })
  return response.ok
}

export const getAnimals = () => request<Animal[]>(animaisApiUrl, '/animais/')

export const createAnimal = (data: CreateAnimalPayload) =>
  request<Animal>(animaisApiUrl, '/animais', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const sellAnimal = (id: number, data: SellAnimalPayload) =>
  request<Animal>(animaisApiUrl, `/animais/${id}/venda`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

export const checkProducoesHealth = async (signal?: AbortSignal) => {
  const response = await fetch(`${producoesApiUrl}/health`, { signal })
  return response.ok
}

export const getProducoes = () => request<Producao[]>(producoesApiUrl, '/producoes')

export const getEstoqueProducoes = () =>
  request<EstoqueProducao[]>(producoesApiUrl, '/producoes/estoque')

export const createProducao = (data: CreateProducaoPayload) =>
  request<Producao>(producoesApiUrl, '/producoes', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const sellProducao = (id: number, data: SellProducaoPayload) =>
  request<Producao>(producoesApiUrl, `/producoes/${id}/venda`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })