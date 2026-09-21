const required = (name: string): string => {
	const value = process.env[name]
	if (!value) {
		throw new Error(`Variável de ambiente ausente: ${name}`)
	}
	return value
}

const requiredNumber = (name: string): number => {
	const value = required(name)
	const parsed = Number(value)
	if (Number.isNaN(parsed)) {
		throw new Error(`Variável de ambiente inválida (esperado número): ${name}=${value}`)
	}
	return parsed
}

export const ENV = {
	nodeEnv: required('NODE_ENV'),
	port: requiredNumber('PORT'),
	producoesServiceUrl: required('PRODUCOES_SERVICE_URL'),
} as const