import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable, from } from "rxjs";
import { HttpInterceptorParams } from "./http-interceptor-params";

export abstract class ApiInterceptor implements HttpInterceptor {
  abstract interceptAsync(req: HttpRequest<any>, interceptorParams: HttpInterceptorParams, next: HttpHandler): Promise<HttpEvent<any>>;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.params instanceof HttpInterceptorParams) {
      return from(this.interceptAsync(req, req.params, next));
    }
    return next.handle(req);
  }
}
