import { McpServer } from '@modelcontextprotocol/server'
import { hostHeaderValidation, NodeStreamableHTTPServerTransport } from '@modelcontextprotocol/node'
import { ENV } from '@config/env'
import { createServer } from 'node:http'
import { z } from 'zod'

const validateHost = hostHeaderValidation(['localhost', '127.0.0.1', 'farmoo-animais-mcp'])

const getJson = async (path: string): Promise<unknown> => {
	const response = await fetch(`${ENV.animaisServiceUrl}${path}`, {
		headers: { Accept: 'application/json' },
		signal: AbortSignal.timeout(5_000),
	})

	if (!response.ok) {
		throw new Error(`Serviço de animais respondeu com status ${response.status}`)
	}

	return response.json()
}

const toolResponse = (data: unknown) => ({
	content: [{ type: 'text' as const, text: JSON.stringify(data) }],
	structuredContent: { data },
})

const createMcpServer = () => {
	const server = new McpServer({ name: 'farmoo_animais', version: '1.0.0' })

	server.registerTool(
		'listar_animais',
		{
			description:
				'Lista todos os animais da fazenda, incluindo tipo, origem, situação e dados de compra, nascimento ou venda.',
			inputSchema: z.object({}),
		},
		async () => toolResponse(await getJson('/animais/')),
	)

	server.registerTool(
		'buscar_animal_por_id',
		{
			description: 'Busca os detalhes de um animal específico pelo identificador numérico.',
			inputSchema: z.object({
				id: z.number().int().positive().describe('Identificador do animal'),
			}),
		},
		async ({ id }) => toolResponse(await getJson(`/animais/${id}`)),
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
		console.error('Erro ao processar requisição MCP de animais', error)
		if (!response.headersSent) response.writeHead(500).end()
	}
})

httpServer.listen(ENV.port, '0.0.0.0', () => {
	console.log(`MCP de animais disponível em http://0.0.0.0:${ENV.port}/mcp`)
})