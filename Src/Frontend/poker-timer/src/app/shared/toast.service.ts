import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material";

@Injectable()
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  public showError(error: any) {
    this.snackBar.open(error, undefined, <MatSnackBarConfig>{ horizontalPosition: "center", verticalPosition: "top", duration: 5000 });
    //this.snackBar.open(error);
  }
}
