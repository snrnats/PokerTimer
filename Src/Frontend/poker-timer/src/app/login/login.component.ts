import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AuthService } from "@app/auth.service";
import { ApiError } from "@app/api/errors/api-error";
import * as HttpStatus from "http-status-codes";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public errorMessage: string;

  constructor(private fb: FormBuilder, public auth: AuthService, private router: Router) {
    this.form = fb.group({
      username: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() { }

  public async signIn() {
    try {
      this.errorMessage = undefined;
      await this.auth.login(this.form.value);
      this.router.navigate(["/"]);
    } catch (e) {
      if (e instanceof ApiError && e.httpStatusCode === HttpStatus.UNPROCESSABLE_ENTITY) {
        this.errorMessage = e.message;
      } else {
        throw e;
      }
    }
  }
}
