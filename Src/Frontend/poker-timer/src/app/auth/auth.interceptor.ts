import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, from } from "rxjs";
import { AuthService } from "@app/auth.service";
import { UnauthorizedError } from "@app/auth/errors/unauthorized-error";
import { AccessTokenResponse } from "@app/auth/model/access-token-response";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  async interceptAsync(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    if (this.authService.isAuthenticated) {
      let token: AccessTokenResponse;
      if (this.authService.isTokenFresh) {
        token = this.authService.getCachedToken();
      } else {
        token = await this.authService.refreshToken();
      }
      let authRequest = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token.accessToken}`)
      });
      try {
        return await next.handle(authRequest).toPromise();
      } catch (e) {
        if (e instanceof HttpErrorResponse) {
          if (e.status === 401) {
            // retry only if token expired during the request
            if (this.authService.isAuthenticated) {
              if (!this.authService.isTokenFresh) {
                token = await this.authService.refreshToken();
                authRequest = req.clone({
                  headers: req.headers.set("Authorization", `Bearer ${token.accessToken}`)
                });
                return await next.handle(authRequest).toPromise();
              }
            }
          }
        }
      }
    }
    this.router.navigate(["/login"]);
    throw new UnauthorizedError("You are not authenticated");
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes("api/account")) {
      return next.handle(req);
    }
    return from(this.interceptAsync(req, next));
  }

  /*intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authService.isAuthenticated) {
            let token$: Observable<AccessTokenResponse>;
            if (this.authService.isTokenFresh) {
                token$ = Observable.create(this.authService.getToken());
            } else {
                token$ = this.authService.refreshToken();
            }
            token$.pipe(mergeMap((token) => {
                const authRequest = req.clone({
                    headers: req.headers.set("Authorization", `Bearer ${token.accessToken}`)
                });
                return next.handle(authRequest);
            }), catchError((err, caught) => this.handleError(err, caught)));
        }
        return Observable.throw(new UnauthorizedError());
    }

    private handleError(err: HttpErrorResponse, caught: Observable<HttpEvent<any>>): Observable<HttpEvent<any>> {
        if (err.status === 401) {
            if (this.authService.isAuthenticated) {
                this.authService.refreshToken().pipe(mergeMap((v) => caught));
            }
        }
        return Observable.throw(err);
    }
*/
}
