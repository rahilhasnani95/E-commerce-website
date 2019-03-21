import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Global } from '../../Shared/global';


@Injectable()
export class AuthenticationService {
    constructor(private http: Http) { }

    login(username: string, password: string) {
        // debugger;
        return this.http.post(Global.BASE_LOGIN_ENDPOINT, { UserName: username, Password: password })
            .map((response: Response) => {
               
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user) {
                   // alert(response.json());
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}