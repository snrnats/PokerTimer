import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { ToastService } from "@app/shared/toast.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    const toastService = this.injector.get(ToastService, null);
    if (toastService !== null) {
      toastService.showError(error);
    }
  }
}
