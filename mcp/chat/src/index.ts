import { GoogleGenAI, mcpToTool, type Content } from '@google/genai'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { z } from 'zod'
import { ENV } from './config/env.js'

const FARMER_PERSONA = `Você é um pequeno produtor rural brasileiro que usa o Farmoo para administrar sua propriedade.
Nela você trabalha com animais, como vacas, galinhas, ovelhas, porcos, jumentos, cavalos, patos. Alguns desses animais 
produzem produtos como leite, ovos, lã e carne, como a vaca, galinha, ovelha, porco e pato. Outros não produzem, como o jumento e o cavalo.
O fazendeiro precisa conhecer bem cada animal e suas produções para gerir a propriedade de forma eficiente. Precisa saber
qual animal produz o quê. Qual animal tem lucro maior na venda de si próprio e dos produtos.
Fale em português do Brasil, com linguagem simples e prática, como alguém experiente na rotina de uma pequena propriedade.
Use as ferramentas disponíveis sempre que a pergunta depender dos dados reais dos animais, das produções, do estoque, dos custos, das vendas ou dos resultados.
Nunca invente dados. Se uma ferramenta estiver indisponível ou não houver informação suficiente, diga isso claramente.
Você tem acesso somente para consulta: não prometa cadastrar, alterar, vender ou excluir registros.
Responda de forma curta e direta, destacando números importantes.
Não adicione estilização na resposta como negrito ou itálico.`

const messageSchema = z.object({
  message: z.string().trim().min(1).max(2_000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string().trim().min(1).max(4_000),
      }),
    )
    .max(20)
    .default([]),
})

let clientsPromise: Promise<[Client, Client, Client]> | null = null

const connectMcpClient = async (name: string, url: string) => {
  const client = new Client({ name: `farmoo_chat_${name}`, version: '1.0.0' })
  await client.connect(new StreamableHTTPClientTransport(new URL(url)))
  return client
}

const getMcpClients = async () => {
  clientsPromise ??= Promise.all([
    connectMcpClient('animais', ENV.animaisMcpUrl),
    connectMcpClient('producoes', ENV.producoesMcpUrl),
    connectMcpClient('financeiro', ENV.financeiroMcpUrl),
  ])

  try {
    return await clientsPromise
  } catch (error) {
    clientsPromise = null
    throw error
  }
}

const readJsonBody = async (request: IncomingMessage): Promise<unknown> => {
  let body = ''

  for await (const chunk of request) {
    body += chunk
    if (body.length > 100_000) throw new Error('Corpo da requisição muito grande')
  }

  return JSON.parse(body)
}

const sendJson = (response: ServerResponse, status: number, body: unknown) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  response.end(JSON.stringify(body))
}

const answerQuestion = async (input: z.infer<typeof messageSchema>) => {
  const [animaisClient, producoesClient, financeiroClient] = await getMcpClients()
  const ai = new GoogleGenAI({ apiKey: ENV.geminiApiKey })
  const contents: Content[] = [
    ...input.history.map(({ role, content }) => ({ role, parts: [{ text: content }] })),
    { role: 'user', parts: [{ text: input.message }] },
  ]

  const result = await ai.models.generateContent({
    model: ENV.geminiModel,
    contents,
    config: {
      systemInstruction: FARMER_PERSONA,
      tools: [mcpToTool(animaisClient, producoesClient, financeiroClient)],
      temperature: 0.3,
    },
  })

  if (!result.text) throw new Error('O Gemini não retornou uma resposta')
  return result.text
}

const httpServer = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    })
    response.end()
    return
  }

  if (request.method === 'GET' && request.url === '/health') {
    sendJson(response, 200, {
      status: 'ok',
      geminiConfigured: true,
    })
    return
  }

  if (request.method !== 'POST' || request.url !== '/chat') {
    sendJson(response, 404, { error: 'Rota não encontrada' })
    return
  }

  try {
    const input = messageSchema.parse(await readJsonBody(request))
    const answer = await answerQuestion(input)
    sendJson(response, 200, { answer })
  } catch (error) {
    console.error('Erro no chat Gemini', error)
    const message = error instanceof Error ? error.message : 'Não foi possível responder agora'
    sendJson(response, error instanceof z.ZodError ? 400 : 503, { error: message })
  }
})

httpServer.listen(ENV.port, '0.0.0.0', () => {
  console.log(`Chat Gemini disponível em http://0.0.0.0:${ENV.port}/chat`)
})
