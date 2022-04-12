import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { User } from 'src/app/_models/index';

import { HashUtils } from 'src/app/_helpers';
import { Metadata } from 'src/app/_models';
import { environment } from 'src/environments/environment';
import { CommonClientService } from './commonclient.service';

import { HttpClient } from '@angular/common/http';
import { Log } from './log.service';
/*
* Credits :
* based on http://jasonwatmore.com/post/2016/09/29/angular-2-user-registration-and-login-example-tutorial
*/
@Injectable()
export class AdminService extends CommonClientService {

  constructor(private log: Log, private http: HttpClient) {
    super();
    this.init(environment.server, environment.apiuri + '/adminapi');
  }


  public getIndex = (type: string): Observable<any[]> => {

    const url: string = this.getUrl('/index/' + type);
    this.log.debug('admin getIndex ' + url);

    return this.http.get<any[]>(url, {headers: this.jwt()});
  }


  /**
   * save a record
   */
  public rebuildIndex = (type: string): Observable<any> => {

    // eg : /index/calendar
    const url: string = this.getUrl('/index/' + type);
    this.log.debug('admin rebuildIndex ' + url);

    const postData = 'requestbody={}';

    return this.http.post<any>(url,
      postData,
      {headers: this.jwtPost()});

  }



  /**
   * Table metadata for record modification
   */
  public getMetadata = (type: string): Observable<Metadata[]> => {

    if (type === 'users/index/metadata.json') {
      let userMetadata: Metadata[] = null;
        userMetadata = JSON.parse('\
        [\
    	{"name" : "email" , "primary" : "true", "type" : "string",  "editor":"line"},\
      {"name" : "name" , "primary" : "false", "type" : "string",  "editor":"line"},\
      {"name" : "role" , "primary" : "false", "type" : "text",  "editor":"choice", "choices" : ["guest", "editor", "admin"]},\
      {"name" : "password" , "primary" : "true", "type" : "password",  "editor":"line"},\
      {"name" : "status" , "primary" : "false", "type" : "text",  "editor":"choice", "choices" : ["active", "inactive", "changepassword"]}\
        ]\
        ');
      return of(userMetadata);
    } else {
      const url: string = this.getUrl('/metadata/' + type);
      return this.http.get<Metadata[]>(url, {headers: this.jwt()});
    }



  }


    put(type: string, userInput: any) {
    if (type === 'users') {
      const hashUtils = new HashUtils();

      const url: string = this.getUrl('/content/' + type);
      const user = JSON.parse('{"name":"", "email":"", "password":"", "secretQuestion":"", "secretResponse":"" }');
      user.name = userInput.name;
      user.email = userInput.email;
      user.password = userInput.email;
      user.password = hashUtils.hash64(userInput.password);


      const data = this.getRequestBody(user);

      return this.http.put<any>(url, data,
                  {headers: this.jwtPost()});
    }

    }

    postUser(type: string, userInput: any) {
    if (type === 'users') {
      const hashUtils = new HashUtils();

      const url: string = this.getUrl('/content/' + type);
      const user = JSON.parse('{"name":"", "email":"", "password":"", "secretQuestion":"", "secretResponse":"" }');
      user.name = userInput.name;
      user.email = userInput.email;
      user.password = hashUtils.hash64(userInput.password);


    const data = this.getRequestBody({
      email: user.email,
      password: user.password,
      name : user.name,
      secretQuestion : user.secretResponse,
      secretResponse : user.secretResponse
    });


      return this.http.post(url, data,
                  {headers: this.jwtPost()});
    }

    }

    public disableUser(type: string, userInput: any): Observable<any> {
    if (type === 'users') {
      const hashUtils = new HashUtils();


      const url: string = this.getUrl('/content/' + type + '/' + userInput.email);
      let data = '';
      if (userInput.password) {

        data = this.getRequestBody({ email: userInput.email,
          role : 'none',
          name : userInput.name
           });

      } else {

        data = this.getRequestBody(userInput);

      }


      return this.http.post(url, data,
                  {headers: this.jwtPost()});
    }

    }

  public updateUser(type: string, userInput: any): Observable<any> {
  if (type === 'users') {
    const hashUtils = new HashUtils();


    const url: string = this.getUrl('/content/' + type + '/' + userInput.email);
    let data = '';
    if (userInput.password) {

      data = this.getRequestBody({ email: userInput.email,
        newpassword: hashUtils.hash64(userInput.password),
        role : userInput.role,
        name : userInput.name
         });

    } else {

      data = this.getRequestBody(userInput);

    }


    return this.http.post(url, data,
                {headers: this.jwtPost()});
  }

  }


      /**
       * get a single record
       * @arg type : news, calendar, ...
       * @arg id : unique id
       * @returns Observable of a JSON record
       */
      public getRecord = (type: string, id: string): Observable<any> => {
          const url: string = this.getUrl('/content/' + type + '/' + id);
          this.log.debug(url);


          return this.http.get<any>(url, {headers: this.jwt()});
      }

      /**
       * Table metadata for record modification
       */
      public getNewRecord = (file: string): Observable<any[]> => {
        let userMetadata: Metadata[] = null;
        if (file === 'users') {

          userMetadata = JSON.parse('\
          {\
              "name": "",\
              "email": "",\
              "password": "",\
              "role": ""\
          }\
          ');

        }

        return of(userMetadata);
      }



  getAll() {
    return this.http.get('/api/users', {headers: this.jwt()});
  }

  getById(id: number) {
    return this.http.get('/api/users/' + id, {headers: this.jwt()});
  }

  create(user: User) {
    return this.http.post('/api/users', user, {headers: this.jwt()});
  }

  update(user: User) {
    return this.http.put('/api/users/' + user.id, user, {headers: this.jwt()});
  }

  /**
   * delete a record
   */
  public delete = (type: string, id: string): Observable<any> => {

      // eg : /content/calendar
      const url: string = this.getUrl('/content/' + type + '/' + id);
      this.log.debug('delete' + url);


      return this.http.delete(url,
          {headers: this.jwt()});

  }
}
