import { Injectable } from "@angular/core";
import { HttpClient, HttpInterceptor } from "@angular/common/http";
import { Subject } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(req, next) {
        const token = localStorage.getItem("token");
        const authRequest = req.clone({
            headers: req.headers.set("Authorization", `Bearer ${token}`)
        });
        return next.handle(authRequest);
    }

}
