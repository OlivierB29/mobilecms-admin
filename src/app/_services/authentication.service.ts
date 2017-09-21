import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';


import { environment } from '../../environments/environment';

import { HashUtils } from 'app/_helpers';

import { User } from 'app/_models/index';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


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


  constructor(private http: HttpClient) { }

  private getHeaders() {
    return new HttpHeaders ({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
  }

  login(user: string, password: string, mode: string) {
    console.log('login...');

    localStorage.removeItem('currentUser');

    // TODO RESTful endpoint
    const url: string = this.getUrl('/authenticate');



    const data = 'requestbody=' + JSON.stringify({ user: user, password: this.getPassword(password, mode) });

      return this.http.post<any>(url, data, { headers: this.getHeaders() });
  }

  private getPassword(password: string, mode: string) {
    let data = '';
    const hashUtils = new HashUtils();

    if ( 'hashmacbase64' === mode) {
      data = hashUtils.hash64(password);
    } else if ( 'none' === mode ) {
      data =  password;
    } else {
      data =  hashUtils.hash(password);
    }
    return data;
  }

  register(userInput: any) {
    const hashUtils = new HashUtils();


    const url: string = this.getUrl('/register');
    userInput.password = hashUtils.hash64(userInput.password);
    const data = 'requestbody=' + JSON.stringify(userInput);

    return this.http.post(url, data, { headers: this.getHeaders() });
  }

  resetpassword(user: string) {
    const hashUtils = new HashUtils();

    const url: string = this.getUrl('/resetpassword');
    const data = 'requestbody=' + JSON.stringify({user: user});
    return this.http.post(url, data, { headers: this.getHeaders() })
      .map((response: Response) => {
        const registerResponse = response.json();
      });
  }

  publicinfo(user: string) {

    const url: string = this.getUrl('/publicinfo/' + user);
      return this.http.get<any>(url);

  }

  publicinfoUrl(user: string) {

    return this.getUrl('/publicinfo/' + user);

  }



  changepassword(user: string, oldPassword: string, newPassword: string, oldPasswordMode: string) {
    const hashUtils = new HashUtils();
    const url: string = this.getUrl('/changepassword');

    const newPasswordMode = 'hashmacbase64';
    const data = 'requestbody=' + JSON.stringify({ user: user,
        newpassword: this.getPassword(newPassword, newPasswordMode),
        password: this.getPassword(oldPassword, oldPasswordMode)
         });

    return this.http.post<any>(url, data, { headers: this.getHeaders() });
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
