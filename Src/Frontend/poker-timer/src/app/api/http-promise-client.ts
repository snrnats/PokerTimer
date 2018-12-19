import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest } from "@angular/common/http";
import { JsonRevivers } from "@app/shared/json-revivers";
import { ServerError } from "./errors/server-error";
import { ApiError } from "./errors/api-error";
import { NetworkError } from "./errors/network-error";
import { isErrorResponse } from "./error-response";
import { HttpParamsOptions } from "@angular/common/http/src/params";
import { Observable } from "rxjs";
import { HttpInterceptorParams } from "@app/api/http-interceptor-params";
import { IInterceptorConfig } from "./interceptor-config";

type AppErrors = ServerError | ApiError | NetworkError;
type Query = { [param: string]: string | string[] };

export class HttpPromiseClient {
  constructor(private http: HttpClient) {}

  async get<T>(url: string, options?: { headers?: HttpHeaders; query?: Query; interceptorConfig?: IInterceptorConfig }): Promise<T> {
    return await this.request<T>("GET", url, options);
  }
  async post<T>(
    url: string,
    body: any,
    options?: { headers?: HttpHeaders; query?: Query; interceptorConfig?: IInterceptorConfig }
  ): Promise<T> {
    return await this.request<T>("POST", url, { ...options, body: body });
  }

  async put<T>(
    url: string,
    body: any,
    options?: { headers?: HttpHeaders; query?: Query; interceptorConfig?: IInterceptorConfig }
  ): Promise<T> {
    return await this.request<T>("PUT", url, { ...options, body: body });
  }

  async delete<T>(url: string, options?: { headers?: HttpHeaders; query?: Query; interceptorConfig?: IInterceptorConfig }): Promise<T> {
    return await this.request<T>("DELETE", url, options);
  }

  public async request<T>(
    method: string,
    url: string,
    options: { body?: T; headers?: HttpHeaders; query?: Query; interceptorConfig?: IInterceptorConfig }
  ): Promise<T> {
    try {
      const responseText = await this.http
        .request(method, url, {
          body: options.body,
          headers: options.headers,
          responseType: "text",
          params: new HttpInterceptorParams(options.interceptorConfig, options.query)
        })
        .toPromise();
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
