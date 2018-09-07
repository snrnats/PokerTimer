import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Credentials } from "@app/models/credentials.model";
import { Router } from "@angular/router";
import { Config } from "@app/shared/config";
import * as jwt_decode from "jwt-decode";
import { AccessTokenResponse } from "@app/auth/model/access-token-response";
import { Observable } from "rxjs";
import { catchError } from "../../node_modules/rxjs/operators";

@Injectable()
export class AuthService {

  private static readonly AccessTokenKey = "accessTokenResponse";
  constructor(private http: HttpClient, private router: Router) { }


  get isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  get isTokenFresh(): boolean {
    const token = this.getToken();
    return token && token.expires > new Date().getTime();
  }

  getUserId(): string {
    const t = this.getToken();
    if (t !== null) {
      const data = jwt_decode(t);
      console.log(data);
      if (data.hasOwnProperty("sub")) {
        return data["sub"];
      }
    }
    return null;
  }

  register(credentials: Credentials): void {
    this.http.post<AccessTokenResponse>(Config.backendUrl + `api/account/register`, credentials, ).subscribe(res => {
      this.authenticate(res);
    });
  }

  login(credentials: Credentials): void {
    this.http.post<AccessTokenResponse>(Config.backendUrl + `api/account/token`, credentials).subscribe(res => {
      this.authenticate(res);
    });
  }

  logout(): void {
    localStorage.removeItem("token");

    this.router.navigate(["/"]);
  }
  getToken(): AccessTokenResponse | null {
    var localToken = localStorage.getItem(AuthService.AccessTokenKey);
    return localToken ? JSON.parse(localToken) : null;
  }

  refreshTokenIfNeeded(): Observable<AccessTokenResponse> {

  }

  public async refreshToken(): Promise<AccessTokenResponse> {
    if (this.isAuthenticated) {
      let token = this.getToken();
      try {
        token = await this.http.post<AccessTokenResponse>(Config.backendUrl + 'api/account/refresh-token', { refreshToken: token.refreshToken, userId: token.userId }).toPromise();
        return token;
      }
      catch (err) {
        if (err instanceof HttpErrorResponse && err.status === 422) {
          // wrong combination of userId and refreshToken
        }
      }
    }
  }


  private authenticate(accessTokenResponse: AccessTokenResponse): void {
    localStorage.setItem("accessTokenResponse", JSON.stringify(accessTokenResponse));
    this.router.navigate(["/"]);
  }
}
