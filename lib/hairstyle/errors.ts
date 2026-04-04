export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = "HttpError"
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError
}
