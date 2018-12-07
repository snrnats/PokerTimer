import { HttpPromiseClient } from "./http-promise-client";
import { AuthService } from "@app/auth.service";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { ApiError } from "./errors/api-error";
import * as HttpStatus from "http-status-codes";
import { Observable, pipe } from "rxjs";
import { retry, retryWhen } from "rxjs/operators";

export class ApiClient {
  constructor(private http: HttpPromiseClient, private auth: AuthService, private inHtpp: HttpClient) {}

  async get<T>(url: string): Promise<T> {
    return await this.wrapRequest(headers => this.http.get<T>(url, headers));
  }

  getObs<T>(url: string): Observable<T> {
    return this.inHtpp.get(url).pipe(retryWhen(error => {}));
  }

  async post<T>(url: string, body: string): Promise<T> {
    return await this.wrapRequest(headers => this.http.post<T>(url, body, headers));
  }

  async wrapRequest<T>(request: (headers: HttpHeaders) => Promise<T>): Promise<T> {
    let token = this.auth.getCachedToken();
    if (!token || !token.isFresh) {
      token = await this.auth.refreshToken();
    }
    let headers = new HttpHeaders({ Authorization: token.accessToken });
    try {
      return await request(headers);
    } catch (e) {
      if (e instanceof ApiError && e.errorCode === HttpStatus.UNAUTHORIZED) {
        // force refresh token and try again
        await this.auth.refreshToken();
        headers = new HttpHeaders({ Authorization: token.accessToken });
        return await request(headers);
      }
      throw e;
    }
  }
}
