import { HttpStatusCode } from './types'

type HttpErrorOptions = {
  status: number
  details: unknown
}

export class HttpError extends Error {
  readonly status: number
  readonly details: unknown

  constructor(message: string, options: HttpErrorOptions) {
    super(message)
    this.name = 'HttpError'
    this.status = options.status
    this.details = options.details
  }
}

export class ValidationError extends HttpError {
  constructor(message: string, details: unknown) {
    super(message, { status: HttpStatusCode.BAD_REQUEST, details })
    this.name = 'ValidationError'
  }
}