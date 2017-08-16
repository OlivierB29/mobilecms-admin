﻿import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { environment } from '../../environments/environment';

import { HashUtils } from 'app/_helpers';

import { User } from 'app/_models/index';

/*
* Credits :
* based on http://jasonwatmore.com/post/2016/09/29/angular-2-user-registration-and-login-example-tutorial
*/
@Injectable()
export class AuthenticationService {

  private serverUrl = environment.server;


  /**
  * API endpoint
  */
  private api = environment.authapi;


  constructor(private http: Http) { }

  login(user: string, password: string) {
    console.log('login...');
    const hashUtils = new HashUtils();

    localStorage.removeItem('currentUser');
    //
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    // TODO RESTful endpoint
    const url: string = this.getUrl('/authenticate');
    const data = 'requestbody=' + encodeURIComponent(JSON.stringify({ user: user, password: hashUtils.hash(password) }));

    return this.http.post(url, data, { headers: headers })
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        const userObject = response.json();
        if (userObject && userObject.token) {

          // store user details and jwt token in local storage to keep user logged in between page refreshes

          localStorage.setItem('currentUser', JSON.stringify(userObject));
        } else {
          console.error('invalid auth token');
          throw new Error('invalid auth token');
        }
      });
  }

  register(userInput: any) {
    const hashUtils = new HashUtils();
    //
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');


    const url: string = this.getUrl('/register');
    userInput.password = encodeURIComponent(hashUtils.hash(userInput.password));
    const data = 'requestbody=' + JSON.stringify(userInput);

    return this.http.post(url, data, { headers: headers })
      .map((response: Response) => {
        const registerResponse = response.json();
      });
  }




  changepassword(userInput: any) {
    const hashUtils = new HashUtils();
    const url: string = this.getUrl('/changepassword');

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');



    const data = 'requestbody=' + encodeURIComponent(JSON.stringify({ email: userInput.email,
      newpassword: hashUtils.hash(userInput.newpassword),
      password: hashUtils.hash(userInput.password)
       }));
    return this.http.post(url, data, { headers: headers })
      .map((response: Response) => {
        const registerResponse = response.json();
      });
  }


  /**
  * get API url
  * @arg path  eg : '/content'
  * @returns http://localhost//adminapp/api.php?path=/content
  */
  private getUrl(path: string): string {
    return this.serverUrl + this.api + path;
  }

  public logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

  public initUser(): User {
    let currentUser: User = null;
    const currentUserLocalStorage = localStorage.getItem('currentUser');
    if (currentUserLocalStorage) {
      currentUser = JSON.parse(currentUserLocalStorage);
      currentUser.token = '';
    }
    return currentUser;
  }
}
