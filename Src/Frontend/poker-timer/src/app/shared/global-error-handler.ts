import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { ToastService } from "@app/shared/toast.service";

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(private injector: Injector) {
    super();
  }

  handleError(error: any): void {
    this.handleErrorInternal(error);
    //super.handleError(error);
    console.error(error, {error: error});
  }

  private handleErrorInternal(error: any): void {
    const toastService = this.injector.get(ToastService);
    if ("rejection" in error) {
      this.handleErrorInternal(error.rejection);
    } else if (error instanceof Error) {
      toastService.showError(error.message);
    } else {
      toastService.showError(error);
    }
  }
}
