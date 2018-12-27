import { Component, OnInit } from "@angular/core";
import { AuthService } from "@app/auth.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AccessTokenResponse } from "@app/auth/model/access-token-response";
import { IErrorResponse } from "@app/api/error-response";
import { Credentials } from "@app/models/credentials.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = fb.group({
      username: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  async register() {
    await this.auth.register({ email: this.form.get("username").value, password: this.form.get("password").value });
    this.router.navigate(["/"]);
  }

  ngOnInit() { }
}
