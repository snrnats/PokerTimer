import { ServerError } from "./server-error";
import { HttpErrorResponse } from "@angular/common/http";
import { NetworkError } from "./network-error";
import { ApiError } from "./api-error";
import { isErrorResponse } from "../error-response";

type AppErrors = ServerError | ApiError | NetworkError;

export function convertHttpError(error: HttpErrorResponse): AppErrors {
  if (error.status === 0) {
    return new NetworkError(error.message);
  } else if (isErrorResponse(error.error)) {
    return new ApiError(error.status, error.error.code, error.error.message);
  } else {
    return new ServerError(error.status, error.message);
  }
}
