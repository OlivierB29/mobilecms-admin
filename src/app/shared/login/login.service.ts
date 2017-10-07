import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';



import { HashUtils } from 'app/_helpers';

import { User } from 'app/_models/index';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';


/*
* Credits :
* based on http://jasonwatmore.com/post/2016/09/29/angular-2-user-registration-and-login-example-tutorial
*/
@Injectable()
export class LoginService {

  private serverUrl = environment.server;

  private postFormData = false;

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



    const data = this.getRequestBody({ user: user, password: this.getPassword(password, mode) });

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
    const data = this.getRequestBody(userInput);

    return this.http.post(url, data, { headers: this.getHeaders() });
  }

  resetpassword(user: string) {
    const hashUtils = new HashUtils();

    const url: string = this.getUrl('/resetpassword');
    const data = this.getRequestBody({user: user});
    return this.http.post(url, data, { headers: this.getHeaders() });
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
    const data = this.getRequestBody({ user: user,
        newpassword: this.getPassword(newPassword, newPasswordMode),
        password: this.getPassword(oldPassword, oldPasswordMode)
         });

    return this.http.post<any>(url, data, { headers: this.getHeaders() });
  }

  private getRequestBody(obj: any) {
    let data = null;
    if (this.postFormData) {
      data = this.getRequestBody(obj)
    } else {
      data = obj;
    }
    return obj;
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

  public resetToken(): User {
    let currentUser: User = null;
    const currentUserLocalStorage = localStorage.getItem('currentUser');
    if (currentUserLocalStorage) {
      currentUser = JSON.parse(currentUserLocalStorage);
      currentUser.token = '';
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    return currentUser;
  }

  /**
  * lightweight client control : authencation is ensured by the API
  */
  public isAuthenticated(): boolean {
    let result = false;
    const currentUserLocalStorage = localStorage.getItem('currentUser');
    if (currentUserLocalStorage) {
      const currentUser = JSON.parse(currentUserLocalStorage);
      if (currentUser.token != null && currentUser.token !== '') {
        result = true;
      }
    }
    return result;
  }
}
