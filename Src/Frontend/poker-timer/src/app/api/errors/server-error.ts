import { AppError } from "@app/api/errors/app-error";

export class ServerError extends AppError {
  constructor(public httpStatusCode: number, message: string = "Server encounters some unknown errors", innerError?: Error) {
    super(message, innerError);
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}
