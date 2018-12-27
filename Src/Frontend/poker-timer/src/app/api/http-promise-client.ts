import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest } from "@angular/common/http";
import { JsonRevivers } from "@app/shared/json-revivers";
import { ServerError } from "./errors/server-error";
import { ApiError } from "./errors/api-error";
import { NetworkError } from "./errors/network-error";
import { isErrorResponse, IErrorResponse } from "./error-response";
import { HttpParamsOptions } from "@angular/common/http/src/params";
import { Observable } from "rxjs";
import { HttpInterceptorParams } from "@app/api/http-interceptor-params";
import { IInterceptorConfig } from "./interceptor-config";
import { Injectable } from "@angular/core";

type AppErrors = ServerError | ApiError | NetworkError;
type Query = { [param: string]: string | string[] };

@Injectable()
export class HttpPromiseClient {
  constructor(private http: HttpClient) { }

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
          body: options ? options.body : undefined,
          headers: options ? options.headers : undefined,
          responseType: "text",
          params: new HttpInterceptorParams(options ? options.interceptorConfig : undefined, options ? options.query : undefined)
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

  private convertHttpError(res: HttpErrorResponse): AppErrors {
    if (res.status === 0) {
      return new NetworkError(res.message);
    }
    const error = typeof res.error === "string" ? JSON.parse(res.error) : res.error;
    if (isErrorResponse(error)) {
      return new ApiError(res.status, error.code, error.message, res);
    } else {
      return new ServerError(res.status, res.message, res);
    }
  }
}
