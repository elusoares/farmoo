import { McpServer } from '@modelcontextprotocol/server'
import { hostHeaderValidation, NodeStreamableHTTPServerTransport } from '@modelcontextprotocol/node'
import { ENV } from '@config/env'
import { createServer } from 'node:http'
import { z } from 'zod'

const validateHost = hostHeaderValidation(['localhost', '127.0.0.1', 'farmoo-producoes-mcp'])

const getJson = async (path: string): Promise<unknown> => {
	const response = await fetch(`${ENV.producoesServiceUrl}${path}`, {
		headers: { Accept: 'application/json' },
		signal: AbortSignal.timeout(5_000),
	})

	if (!response.ok) {
		throw new Error(`Serviço de produções respondeu com status ${response.status}`)
	}

	return response.json()
}

const toolResponse = (data: unknown) => ({
	content: [{ type: 'text' as const, text: JSON.stringify(data) }],
	structuredContent: { data },
})

const createMcpServer = () => {
	const server = new McpServer({ name: 'farmoo_producoes', version: '1.0.0' })

	server.registerTool(
		'listar_producoes',
		{
			description:
				'Lista todos os lotes de produção da fazenda, com animal, produto, quantidade, data, venda e situação.',
			inputSchema: z.object({}),
		},
		async () => toolResponse(await getJson('/producoes')),
	)

	server.registerTool(
		'consultar_estoque',
		{
			description:
				'Consulta o estoque consolidado por produto, mostrando quantidades produzida, vendida e disponível.',
			inputSchema: z.object({}),
		},
		async () => toolResponse(await getJson('/producoes/estoque')),
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
		console.error('Erro ao processar requisição MCP de produções', error)
		if (!response.headersSent) response.writeHead(500).end()
	}
})

httpServer.listen(ENV.port, '0.0.0.0', () => {
	console.log(`MCP de produções disponível em http://0.0.0.0:${ENV.port}/mcp`)
})