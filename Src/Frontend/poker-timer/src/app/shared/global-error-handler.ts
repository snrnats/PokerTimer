import { ErrorHandler, Injectable, Injector, NgZone } from "@angular/core";
import { ToastService } from "@app/shared/toast.service";
import { ServerError } from "@app/api/errors/server-error";
import { ApiError } from "@app/api/errors/api-error";
import { ErrorCodes } from "@app/api/errors/error-codes";
import { Router } from "@angular/router";
import { AuthService } from "@app/auth.service";

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(private injector: Injector) {
    super();
  }

  handleError(error: any): void {
    this.injector.get(NgZone).run(() => {
      if (!this.handleErrorInternal(error)) {
        super.handleError(error);
      }
    });
  }

  private handleErrorInternal(error: any): boolean {
    const toastService = this.injector.get(ToastService);
    if ("rejection" in error) {
      return this.handleErrorInternal(error.rejection);
    } else if (error instanceof ApiError && error.errorCode === ErrorCodes.InvalidRefreshToken) {
      toastService.showError("Your saved credentials are invalid. Logging out...");
      this.injector.get(AuthService).logout();
      return true;
    } else if (error instanceof Error) {
      toastService.showError(error.message);
    } else {
      toastService.showError(error);
    }
    return false;
  }
}
