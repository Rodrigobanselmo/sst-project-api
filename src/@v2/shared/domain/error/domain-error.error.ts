/**
 * The errors of the system follows Go like error handling.
 * The errors are defined as variables and are used as a type.
 * Exceptions are not used in the system. Exceptions must be exceptional. Errors are not exceptional.
 */

export class DomainError {
  public error: symbol
  public message?: string

  constructor(error: symbol, message?: string) {
    this.error = error
    this.message = message
  }

  isSameTypeError(otherError) {
    return this.error === otherError.error
  }
}
