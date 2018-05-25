import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Credentials } from './models/credentials.model';
import { Router } from '@angular/router';
import { Config } from '@app/shared/config';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  get isAuthenticated() {
    return !!localStorage.getItem('token')
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
    localStorage.removeItem("token")

    this.router.navigate(["/"]);
  }
}
