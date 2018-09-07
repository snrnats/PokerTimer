import { Injectable } from "@angular/core";
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Subject, Observable, ObservableInput } from "rxjs";
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AuthService } from "@app/auth.service";
import { UnauthorizedError } from "@app/auth/errors/unauthorized-error";
import { AccessTokenResponse } from "@app/auth/model/access-token-response";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    async test(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
        if (this.authService.isAuthenticated) {            
            let token$: AccessTokenResponse;
            if (this.authService.isTokenFresh) {
                token$ = this.authService.getToken();
            } else {
                token$ =await this.authService.refreshToken();
            }
        const authRequest = req.clone({
            headers: req.headers.set("Authorization", `Bearer ${token.accessToken}`)
        });
        return await next.handle(req).toPromise();
    }
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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

}
