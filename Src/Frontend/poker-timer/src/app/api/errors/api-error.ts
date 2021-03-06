import { ServerError } from "@app/api/errors/server-error";

export class ApiError extends ServerError {
  constructor(httpStatusCode: number, private errorCode: number, message: string) {
    super(httpStatusCode, message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
