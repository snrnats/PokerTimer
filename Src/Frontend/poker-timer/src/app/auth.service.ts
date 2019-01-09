import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Credentials } from "@app/models/credentials.model";
import { Router } from "@angular/router";
import { Config } from "@app/shared/config";
import * as jwt_decode from "jwt-decode";
import { AccessTokenResponse } from "@app/auth/model/access-token-response";
import { IErrorResponse } from "@app/api/error-response";
import { ServerError } from "./api/errors/server-error";
import { ApiError } from "./api/errors/api-error";
import { HttpPromiseClient } from "@app/api/http-promise-client";

@Injectable()
export class AuthService {
  private static readonly AccessTokenKey = "accessTokenResponse";
  constructor(private http: HttpPromiseClient, private router: Router) {}

  get isAuthenticated(): boolean {
    return Boolean(this.getCachedToken());
  }

  get isTokenFresh(): boolean {
    const token = this.getCachedToken();
    return token && token.expires > new Date().getTime() / 1000;
  }

  getUserId(): string {
    const t = this.getCachedToken();
    if (t !== null) {
      const data = jwt_decode(t.accessToken);
      if (data.hasOwnProperty("sub")) {
        return data["sub"];
      }
    }
    return null;
  }

  async register(credentials: Credentials): Promise<AccessTokenResponse | IErrorResponse> {
    const accessToken = await this.http.post<AccessTokenResponse>(Config.backendUrl + `api/account/register`, credentials);
    this.authenticate(accessToken);
    return accessToken;
  }

  async login(credentials: Credentials): Promise<void> {
    const accessToken = await this.http.post<AccessTokenResponse>(Config.backendUrl + `api/account/token`, credentials);
    this.authenticate(accessToken);
  }

  logout(): void {
    localStorage.removeItem(AuthService.AccessTokenKey);
    this.router.navigate(["/login"]);
  }

  getCachedToken(): AccessTokenResponse {
    const localToken = localStorage.getItem(AuthService.AccessTokenKey);
    return localToken ? JSON.parse(localToken) : null;
  }

  async refreshTokenIfNeeded(): Promise<AccessTokenResponse> {
    if (this.isAuthenticated && !this.isTokenFresh) {
      return await this.refreshToken();
    }
    return this.getCachedToken();
  }

  public async refreshToken(): Promise<AccessTokenResponse> {
    if (this.isAuthenticated) {
      let token = this.getCachedToken();
      token = await this.http.post<AccessTokenResponse>(Config.backendUrl + "api/account/refresh-token", {
        refreshToken: token.refreshToken,
        userId: token.userId
      });
      this.authenticate(token);
      return token;
    }
  }

  private authenticate(accessTokenResponse: AccessTokenResponse): void {
    localStorage.setItem(AuthService.AccessTokenKey, JSON.stringify(accessTokenResponse));
  }
}
