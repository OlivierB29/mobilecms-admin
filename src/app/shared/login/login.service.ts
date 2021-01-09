import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';



import { HashUtils } from 'src/app/_helpers';

import { User } from 'src/app/_models/index';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Log } from '../services/log.service';


/*
* Credits :
* based on http://jasonwatmore.com/post/2016/09/29/angular-2-user-registration-and-login-example-tutorial
*/
@Injectable()
export class LoginService {

  private serverUrl = environment.server;

  private postFormData = environment.postformdata;

  private postPublicInfo = true;

  /**
  * API endpoint
  */
  private api = environment.authapi;


  constructor(private log: Log, private http: HttpClient) { }

  private getHeadersOld() {
    return new HttpHeaders ({ 'Content-Type': 'application/json' });
  }


  public getHeaders(): HttpHeaders {
      let headers = new HttpHeaders();

      // for POST
      // https://stackoverflow.com/questions/45286764/angular-4-3-httpclient-doesnt-send-header
      if (this.postFormData) {
        headers = headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      } else {
        headers = headers.append('Content-Type', 'application/json');
      }


      return headers;

  }


  login(user: string, password: string, mode: string, captchaanswer: string) {
    this.log.debug('login...');

    localStorage.removeItem('currentUser');

    // TODO RESTful endpoint
    const url: string = this.getUrl('/authenticate');



    const data = this.getRequestBody({ user: user, password: this.getPassword(password, mode), captchaanswer: captchaanswer });

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

    if (this.postPublicInfo) {
      const url: string = this.getUrl('/publicinfo');
      const data = this.getRequestBody({user: user});
      return this.http.post<any>(url, data, { headers: this.getHeaders() });
    } else {
      const url: string = this.getUrl('/publicinfo/' + user);
      return this.http.get<any>(url);
    }


  }




  changepassword(user: string, oldPassword: string, newPassword: string, oldPasswordMode: string, captchaanswer: string) {
    const hashUtils = new HashUtils();
    const url: string = this.getUrl('/changepassword');

    const newPasswordMode = 'hashmacbase64';
    const data = this.getRequestBody({ user: user,
        newpassword: this.getPassword(newPassword, newPasswordMode),
        password: this.getPassword(oldPassword, oldPasswordMode),
        captchaanswer : captchaanswer
         });

    return this.http.post<any>(url, data, { headers: this.getHeaders() });
  }

  protected getRequestBody(obj: any) {
    let data = null;
    if (this.postFormData) {
      data = this.createRequestBody(obj)
    } else {
      data = obj;
    }
    return obj;
  }

  protected createRequestBody(obj: any) {
    let data = [];
    data['requestbody'] = obj;
    return data;
   // return 'requestbody=' + encodeURIComponent(JSON.stringify(JSON.parse(JSON.stringify(data))));
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




}
