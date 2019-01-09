export class AppError extends Error {
  constructor(message: string, public innerError?: Error) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
