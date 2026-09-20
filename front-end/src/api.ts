import type { Animal, CreateAnimalPayload, SellAnimalPayload } from './types'

const apiUrl = import.meta.env.VITE_ANIMAIS_API_URL ?? '/api/animais'

const getErrorMessage = async (response: Response) => {
  try {
    const body = (await response.json()) as { error?: string; message?: string }
    return body.error ?? body.message ?? 'Não foi possível concluir a operação'
  } catch {
    return 'Não foi possível concluir a operação'
  }
}

const request = async <ResponseBody>(path: string, init?: RequestInit): Promise<ResponseBody> => {
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
  const response = await fetch(`${apiUrl}/health`, { signal })
  return response.ok
}

export const getAnimals = () => request<Animal[]>('/animais/')

export const createAnimal = (data: CreateAnimalPayload) =>
  request<Animal>('/animais', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const sellAnimal = (id: number, data: SellAnimalPayload) =>
  request<Animal>(`/animais/${id}/venda`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })