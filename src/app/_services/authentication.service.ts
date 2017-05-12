import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { environment } from '../environment';


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
  private api = environment.authenticateapi;


  constructor(private http: Http) { }

  login(user: string, password: string) {
    localStorage.removeItem('currentUser');
    //
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    // TODO RESTful endpoint
    const url: string = this.getUrl('/api/v1/authenticate');
    const data = 'requestbody=' + JSON.stringify({ user: user, password: password });

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
          console.log('setItem ' + JSON.stringify(userObject) );
        } else {
          throw new Error('invalid auth token');
        }
      });
  }

  register(userInput: any) {

    //
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');


    const url: string = this.getUrl('/api/v1/register');

    const data = 'requestbody=' + JSON.stringify(userInput);

    return this.http.post(url, data, { headers: headers })
      .map((response: Response) => {
        const registerResponse = response.json();
      });
  }

  /**
  * get API url
  * @arg path  eg : '/api/v1/content'
  * @returns http://localhost//adminapp/api/v1/api.php?path=/api/v1/content
  */
  private getUrl(path: string): string {
    return this.serverUrl + this.api + path;
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}
