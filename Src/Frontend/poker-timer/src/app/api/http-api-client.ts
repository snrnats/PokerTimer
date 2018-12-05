import { HttpClient } from "@angular/common/http";
import { JsonRevivers } from "@app/shared/json-revivers";
import { ServerError } from "./errors/server-error";
import { ApiError } from "./errors/api-error";
import { NetworkError } from "./errors/network-error";
type AppErrors = ServerError | ApiError | NetworkError;
export class HttpApiClient {
  constructor(private http: HttpClient) {}

  async get<T>(url: string): Promise<T> {
    try {
      const responseText = await this.http.get(url, { responseType: "text" }).toPromise();
      const result: T = JSON.parse(responseText, JsonRevivers.date);
      return result;
    } catch (e) {}
  }

  private convertHttpError(error: HttpErrorResponse): AppErrors {
    if (error.status === 0) {
      return new NetworkError(error.message);
    } else if (isErrorResponse(error.error)) {
      return new ApiError(error.status, error.error.code, error.error.message);
    } else {
      return new ServerError(error.status, error.message);
    }
  }
}
