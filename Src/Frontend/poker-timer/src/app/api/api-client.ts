import { HttpPromiseClient } from "./http-promise-client";
import { AuthService } from "@app/auth.service";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { ApiError } from "./errors/api-error";
import * as HttpStatus from "http-status-codes";
import { Observable, pipe, from, of, observable, Subject, ReplaySubject, defer } from "rxjs";
import { retry, retryWhen } from "rxjs/operators";

export class ApiClient {
  constructor(private http: HttpPromiseClient, private auth: AuthService, private inHtpp: HttpClient) {}

  async get<T>(url: string): Promise<T> {
    return await this.wrapAuth(headers => this.http.get<T>(url, headers));
  }

  getObs<T>(url: string): Observable<T> {
    return defer(() => {
      let token = this.auth.getCachedToken();
      let $token = !token || !token.isFresh ? from(this.auth.refreshToken()) : of(token);

      return this.http.getObs<T>(url);
      /*let headers = new HttpHeaders({ Authorization: token.accessToken });
      try {
        return await request(headers);
      } catch (e) {
        if (e instanceof ApiError && e.errorCode === HttpStatus.UNAUTHORIZED) {
          // force refresh token and try again
          await this.auth.refreshToken();
          headers = new HttpHeaders({ Authorization: token.accessToken });
          
        }
        throw e;
      }*/
    });
  }

  async wrapAuth<T>(request: (url: string, header: HttpHeaders) => Promise<T>, url: string, headers: HttpHeaders): Promise<T> {
    let token = this.auth.getCachedToken();
    if (!token || !token.isFresh) {
      token = await this.auth.refreshToken();
    }
    headers.append("Authorization", token.accessToken);
    try {
      return await request(url, headers);
    } catch (e) {
      if (e instanceof ApiError && e.errorCode === HttpStatus.UNAUTHORIZED) {
        // force refresh token and try again
        await this.auth.refreshToken();
        headers = new HttpHeaders({ Authorization: token.accessToken });
        return await request(url, headers);
      }
      throw e;
    }
  }

  private async retry<T>(request: (url: string, header: HttpHeaders) => Promise<T>, url: string, headers: HttpHeaders): Promise<T> {
    try {
      return await request(url, headers);
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        throw this.convertHttpError(e);
      }
      throw e;
    }
  }
}
