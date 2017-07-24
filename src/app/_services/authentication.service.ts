import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { environment } from '../../environments/environment';

import hash, { Hash, HMAC } from 'fast-sha256';
import * as textencoding from 'text-encoding';

import { User } from '../_models/index';

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



    localStorage.removeItem('currentUser');
    //
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    // TODO RESTful endpoint
    const url: string = this.getUrl('/authenticate');
    const data = 'requestbody=' + JSON.stringify({ user: user, password: this.hash(password) });

    return this.http.post(url, data, { headers: headers })
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        const userObject = response.json();
        if (userObject && userObject.token) {
          console.log('connecting ' + userObject.name );
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          if (localStorage.getItem('currentUser')) {
            console.log('emptying ');
            localStorage.removeItem('currentUser');
          }

          localStorage.setItem('currentUser', JSON.stringify(userObject));
        } else {
          throw new Error('invalid auth token');
        }
      });
  }

  register(userInput: any) {

    //
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');


    const url: string = this.getUrl('/register');
    userInput.password = this.hash(userInput.password);
    const data = 'requestbody=' + JSON.stringify(userInput);

    return this.http.post(url, data, { headers: headers })
      .map((response: Response) => {
        const registerResponse = response.json();
      });
  }

  /**
   * Hash an input string password to a sha256 password.
   * Explanation : this is just a client hash. The backend API has its own encrypt features.
   * For the backend API, the hashed password is like the clear password.
   * @param password clear text password
   * @return a sha256 in string format
   */
  private hash(password: string): string {
        const uint8array = new TextEncoder().encode(password);
        const myarray = hash(uint8array);
        return new TextDecoder().decode(myarray);
  }

  changepasssword(userInput: any) {

    //
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');


    const url: string = this.getUrl('/changepassword');
    userInput.password = this.hash(userInput.password);
    const data = 'requestbody=' + JSON.stringify(userInput);

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
