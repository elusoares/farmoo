const colors = {
  cyan: '\u001b[36m',
  yellow: '\u001b[33m',
  red: '\u001b[31m',
  reset: '\u001b[0m',
} as const

const formatMessage = (level: string, color: string, message: string): string => {
  const timestamp = new Date().toISOString()

  return `${color}[${level}]${colors.reset} ${timestamp} ${message}`
}

const logger = {
  info: (message: string, ...details: unknown[]): void => {
    console.info(formatMessage('INFO', colors.cyan, message), ...details)
  },
  warn: (message: string, ...details: unknown[]): void => {
    console.warn(formatMessage('WARN', colors.yellow, message), ...details)
  },
  error: (message: string, ...details: unknown[]): void => {
    console.error(formatMessage('ERROR', colors.red, message), ...details)
  },
}

export default logger