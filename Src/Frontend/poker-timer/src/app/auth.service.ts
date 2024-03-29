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
import { convertHttpError } from "./api/errors/error-converter";

@Injectable()
export class AuthService {
  private static readonly AccessTokenKey = "accessTokenResponse";
  constructor(private http: HttpClient, private router: Router) {}

  get isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  get isTokenFresh(): boolean {
    const token = this.getToken();
    return token && token.expires > new Date().getTime() / 1000;
  }

  getUserId(): string {
    const t = this.getToken();
    if (t !== null) {
      const data = jwt_decode(t.accessToken);
      if (data.hasOwnProperty("sub")) {
        return data["sub"];
      }
    }
    return null;
  }

  async register(credentials: Credentials): Promise<void> {
    await this.http.post(Config.backendUrl + `api/accounts/register`, credentials, { withCredentials: true}).toPromise();
  }

  login(credentials: Credentials): void {
    this.http.post<AccessTokenResponse>(Config.backendUrl + `api/accounts/login`, credentials).subscribe(res => {
      this.authenticate(res);
    });
  }

  logout(): void {
    localStorage.removeItem(AuthService.AccessTokenKey);
    this.router.navigate(["/login"]);
  }

  getToken(): AccessTokenResponse | null {
    const localToken = localStorage.getItem(AuthService.AccessTokenKey);
    return localToken ? JSON.parse(localToken) : null;
  }

  async refreshTokenIfNeeded(): Promise<AccessTokenResponse> {
    if (this.isAuthenticated && !this.isTokenFresh) {
      return await this.refreshToken();
    }
    return this.getToken();
  }

  public async refreshToken(): Promise<AccessTokenResponse> {
    if (this.isAuthenticated) {
      let token = this.getToken();
      token = await this.http
        .post<AccessTokenResponse>(Config.backendUrl + "api/accounts/refresh-token", {
          refreshToken: token.refreshToken,
          userId: token.userId
        })
        .toPromise();
      return token;
    }
  }

  private authenticate(accessTokenResponse: AccessTokenResponse): void {
    localStorage.setItem(AuthService.AccessTokenKey, JSON.stringify(accessTokenResponse));
    this.router.navigate(["/"]);
  }
}
