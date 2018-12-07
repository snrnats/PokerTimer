import { AppError } from "./app-error";

export class NetworkError extends AppError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}
