import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
/*
* Credits :
* based on http://jasonwatmore.com/post/2016/09/29/angular-2-user-registration-and-login-example-tutorial
*/
@Injectable()
export class AuthenticationService {

    private serverUrl = 'http://localhost';
  //private serverUrl = '';



  /**
  * API endpoint
  */
  private api = '/adminapp/api/v1/authenticate.php?path=';


  constructor(private http: Http) { }

  login(user: string, password: string) {
    localStorage.removeItem('currentUser');
    //
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    //TODO RESTful endpoint
    var url: string = this.getUrl('/api/v1/authenticate');
    var data = 'requestbody=' + JSON.stringify({ user: user, password: password });

    return this.http.post(url, data, { headers: headers })
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let userObject = response.json();
        if (userObject && userObject.token) {

          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(userObject));
        }
      });
  }

  register(userInput: any) {

    //
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');


    var url: string = this.getUrl('/api/v1/register');

    var data = 'requestbody=' + JSON.stringify(userInput);

    return this.http.post(url, data, { headers: headers })
      .map((response: Response) => {
        let registerResponse = response.json();
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
