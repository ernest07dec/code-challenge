/**
 * Base error class for application errors
 */
export class AppError {
  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {}

  toString(): string {
    return `${this.code}: ${this.message}`;
  }
}

/**
 * Validation errors (400)
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

/**
 * Not found errors (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    const message = id
      ? `${resource} with id ${id} not found`
      : `${resource} not found`;
    super(message, "NOT_FOUND_ERROR", 404);
  }
}

/**
 * Database errors (500)
 */
export class DatabaseError extends AppError {
  constructor(message: string, cause?: Error) {
    super(
      cause ? `${message}: ${cause.message}` : message,
      "DATABASE_ERROR",
      500
    );
  }
}

/**
 * Internal server errors (500)
 */
export class InternalServerError extends AppError {
  constructor(message: string, cause?: Error) {
    super(
      cause ? `${message}: ${cause.message}` : message,
      "INTERNAL_SERVER_ERROR",
      500
    );
  }
}
