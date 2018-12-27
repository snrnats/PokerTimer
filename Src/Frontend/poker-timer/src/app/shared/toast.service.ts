import { Injectable, NgZone } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material";

@Injectable()
export class ToastService {
  constructor(private snackBar: MatSnackBar, private zone: NgZone) { }

  public showError(error: any) {
    this.zone.run(
      () => this.snackBar.open(error,
        undefined,
        <MatSnackBarConfig>{ horizontalPosition: "center", verticalPosition: "top", duration: 5000 })
    );
  }
}
