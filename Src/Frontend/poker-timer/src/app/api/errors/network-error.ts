import { AppError } from "./app-error";

export class NetworkError extends AppError {
  constructor(message: string, innerError?: Error) {
    super(message, innerError);
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}
