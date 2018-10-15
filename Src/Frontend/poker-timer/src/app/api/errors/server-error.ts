import { AppError } from "@app/api/errors/app-error";

export class ServerError extends AppError {
  constructor(private httpStatusCode: number, message: string = "Server encounters some unknown errors") {
    super(message);
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}
