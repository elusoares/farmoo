import { ENV } from '@config/env'
import { hostHeaderValidation, NodeStreamableHTTPServerTransport } from '@modelcontextprotocol/node'
import { McpServer } from '@modelcontextprotocol/server'
import { createServer } from 'node:http'
import { z } from 'zod'

const validateHost = hostHeaderValidation(['localhost', '127.0.0.1', 'farmoo-financeiro-mcp'])

const getJson = async (path: string): Promise<unknown> => {
  const response = await fetch(`${ENV.financeiroServiceUrl}${path}`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(5_000),
  })

  if (!response.ok) {
    throw new Error(`Serviço financeiro respondeu com status ${response.status}`)
  }

  return response.json()
}

const toolResponse = (data: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(data) }],
  structuredContent: { data },
})

const createMcpServer = () => {
  const server = new McpServer({ name: 'farmoo_financeiro', version: '1.0.0' })

  server.registerTool(
    'listar_custos',
    {
      description:
        'Lista todos os custos gerais e específicos por animal, com tipo, descrição, valor, data e escopo.',
      inputSchema: z.object({}),
    },
    async () => toolResponse(await getJson('/custos'))
  )

  server.registerTool(
    'consultar_resultado',
    {
      description:
        'Consulta lucro ou prejuízo por animal, com custos, valor de venda, resultado e situação.',
      inputSchema: z.object({}),
    },
    async () => toolResponse(await getJson('/resultado'))
  )

  server.registerTool(
    'listar_vendas',
    {
      description:
        'Lista as vendas de lotes de produção, com produto, quantidade, preço unitário, valor total e data.',
      inputSchema: z.object({}),
    },
    async () => toolResponse(await getJson('/vendas'))
  )

  return server
}

const httpServer = createServer(async (request, response) => {
  if (request.url === '/health') {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ status: 'ok' }))
    return
  }

  if (request.url !== '/mcp') {
    response.writeHead(404).end()
    return
  }

  if (!validateHost(request, response)) return

  const server = createMcpServer()
  const transport = new NodeStreamableHTTPServerTransport({ sessionIdGenerator: undefined })

  try {
    await server.connect(transport)
    await transport.handleRequest(request, response)
  } catch (error) {
    console.error('Erro ao processar requisição MCP financeira', error)
    if (!response.headersSent) response.writeHead(500).end()
  }
})

httpServer.listen(ENV.port, '0.0.0.0', () => {
  console.log(`MCP financeiro disponível em http://0.0.0.0:${ENV.port}/mcp`)
})
