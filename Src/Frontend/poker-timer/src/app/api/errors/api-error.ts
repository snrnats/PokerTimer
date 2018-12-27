import { ServerError } from "@app/api/errors/server-error";

export class ApiError extends ServerError {
  constructor(httpStatusCode: number, public errorCode: number, message: string, innerError?: Error) {
    super(httpStatusCode, message, innerError);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
