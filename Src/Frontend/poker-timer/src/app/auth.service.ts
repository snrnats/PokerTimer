import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Credentials } from "./models/credentials.model";
import { Router } from "@angular/router";
import { Config } from "@app/shared/config";
import * as jwt_decode from "jwt-decode";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  private getToken() {
    return localStorage.getItem("token");
  }

  get isAuthenticated() {
    return !!this.getToken();
  }

  getUserId(): string {
    const t = this.getToken();
    if (t !== null) {
      const data = jwt_decode(t);
      console.log(data);
      if (data.hasOwnProperty("sub")) {
        return data["sub"];
      }
    }
    return null;
  }

  register(credentials: Credentials) {
    return this.http.post<string>(Config.backendUrl + `api/account/register`, credentials).subscribe(res => {
      this.authenticate(res);
    });
  }

  login(credentials: Credentials) {
    return this.http.post<string>(Config.backendUrl + `api/account/login`, credentials).subscribe(res => {
      this.authenticate(res);
    });
  }

  authenticate(res) {
    localStorage.setItem("token", res);

    this.router.navigate(["/"]);
  }

  logout() {
    localStorage.removeItem("token");

    this.router.navigate(["/"]);
  }
}
