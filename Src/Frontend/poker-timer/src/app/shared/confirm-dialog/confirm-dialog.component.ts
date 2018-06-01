import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.css"]
})
export class ConfirmDialogComponent implements OnInit {
  title: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialogRef<ConfirmDialogComponent>) {
    this.title = data.title;
  }

  ngOnInit() {
  }

}
