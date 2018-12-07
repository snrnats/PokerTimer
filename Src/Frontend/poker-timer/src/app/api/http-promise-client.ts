import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest } from "@angular/common/http";
import { JsonRevivers } from "@app/shared/json-revivers";
import { ServerError } from "./errors/server-error";
import { ApiError } from "./errors/api-error";
import { NetworkError } from "./errors/network-error";
import { isErrorResponse } from "./error-response";
import { HttpParamsOptions } from "@angular/common/http/src/params";

type AppErrors = ServerError | ApiError | NetworkError;

export class HttpPromiseClient {
  constructor(private http: HttpClient) {}

  async get<T>(url: string, headers?: HttpHeaders): Promise<T> {
    return await this.request<T>("GET", url, undefined, headers);
  }

  async post<T>(url: string, body: string, headers?: HttpHeaders): Promise<T> {
    return await this.request<T>("POST", url, body, headers);
  }

  async put<T>(url: string, body: string, headers?: HttpHeaders): Promise<T> {
    return await this.request<T>("PUT", url, body, headers);
  }

  async delete<T>(url: string, headers?: HttpHeaders): Promise<T> {
    return await this.request<T>("DELETE", url, undefined, headers);
  }

  private async request<T>(method: string, url: string, body?: string, headers?: HttpHeaders): Promise<T> {
    try {
      const responseText = await this.http.request(method, url, { body: body, headers: headers, responseType: "text" }).toPromise();
      const result: T = JSON.parse(responseText, JsonRevivers.date);
      return result;
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        throw this.convertHttpError(e);
      }
      throw e;
    }
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
