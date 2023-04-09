import { Component, OnInit } from "@angular/core";
import { AuthService } from "@app/auth.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AccessTokenResponse } from "@app/auth/model/access-token-response";
import { IErrorResponse } from "@app/api/error-response";
import { Credentials } from "@app/models/credentials.model";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = fb.group({
      username: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  async register(credentials: Credentials): Promise<void> {
    await this.auth.register(credentials);
  }

  ngOnInit() {}
}
