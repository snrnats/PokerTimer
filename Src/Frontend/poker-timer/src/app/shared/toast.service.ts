import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";

@Injectable()
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  public showError(error: any) {
    this.snackBar.open(error, undefined, { horizontalPosition: "center", verticalPosition: "top", duration: 5000 });
  }
}
