import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { ToastService } from "@app/shared/toast.service";

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(private injector: Injector) {
    super();
  }

  handleError(error: any): void {
    const toastService = this.injector.get(ToastService);
    if ("rejection" in error) {
      this.handleError(error.rejection);
    } else if (error instanceof Error) {
      toastService.showError(error.message);
    } else {
      toastService.showError(error);
    }
    super.handleError(error);
    debugger;
  }
}
