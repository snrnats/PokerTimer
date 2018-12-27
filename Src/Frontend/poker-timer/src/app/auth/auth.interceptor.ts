import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, from } from "rxjs";
import { AuthService } from "@app/auth.service";
import { AccessTokenResponse } from "@app/auth/model/access-token-response";
import { Router } from "@angular/router";
import { HttpInterceptorParams } from "@app/api/http-interceptor-params";
import { ApiInterceptor } from "@app/api/api-interceptor";
import { ApiError } from "@app/api/errors/api-error";
import * as HttpStatus from "http-status-codes";

@Injectable()
export class AuthInterceptor extends ApiInterceptor {
  constructor(private authService: AuthService, private router: Router) {
    super();
  }

  async interceptAsync(req: HttpRequest<any>, interceptorParams: HttpInterceptorParams, next: HttpHandler): Promise<HttpEvent<any>> {
    if (!interceptorParams.interceptorConfig || !interceptorParams.interceptorConfig.authorize) {
      return next.handle(req).toPromise();
    }

    let token = this.authService.getCachedToken();
    if (!token || !this.isTokenFresh(token)) {
      token = await this.authService.refreshToken();
    }
    let authRequest = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token.accessToken}`)
    });
    try {
      return await next.handle(authRequest).toPromise();
    } catch (e) {
      if (e instanceof ApiError && e.errorCode === HttpStatus.UNAUTHORIZED) {
        // force refresh token and try again
        token = await this.authService.refreshToken();
        authRequest = req.clone({
          headers: req.headers.set("Authorization", `Bearer ${token.accessToken}`)
        });
        return await next.handle(authRequest).toPromise();
      }
      throw e;
    }
  }

  private isTokenFresh(token: AccessTokenResponse) {
    return token.expires > new Date().getTime() / 1000;
  }
}
