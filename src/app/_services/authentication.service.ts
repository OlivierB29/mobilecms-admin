﻿import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {

    

    constructor(private http: Http) { }

    login(user: string, password: string) {

        //
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');


      var url = 'http://localhost/adminapp/api/v1/auth.php';
      var data = 'requestbody=' + JSON.stringify({ user: user, password: password });

        return this.http.post(url, data,  { headers: headers })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let userObject = response.json();
                if (userObject && userObject.token) {

                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(userObject));
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}
