import { HttpParams } from "@angular/common/http";
import { HttpParamsOptions } from "@angular/common/http/src/params";
import { IInterceptorConfig } from "./interceptor-config";

export class HttpInterceptorParams extends HttpParams {
  constructor(public interceptorConfig: IInterceptorConfig, params?: { [param: string]: string | string[] }) {
    super({ fromObject: params } as HttpParamsOptions);
  }
}
