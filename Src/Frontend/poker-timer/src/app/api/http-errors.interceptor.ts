import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, from } from "rxjs";
import { convertHttpError } from "./errors/error-converter";

export class HttpErrorsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.interceptAsync(req, next));
  }

  async interceptAsync(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    try {
      return await next.handle(req).toPromise();
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        throw convertHttpError(err);
      }
      throw err;
    }
  }
}
