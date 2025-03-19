
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}

export class DocumentNotFoundError extends ApiError {
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class BadRequestError extends ApiError {
  constructor(message) {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}