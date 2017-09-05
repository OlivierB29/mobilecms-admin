import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from 'app/_models/index';

import { HashUtils } from 'app/_helpers';
import { Metadata } from 'app/_models';
import { environment } from '../../environments/environment';
import { RestClientService } from './restclient.service';
/*
* Credits :
* based on http://jasonwatmore.com/post/2016/09/29/angular-2-user-registration-and-login-example-tutorial
*/
@Injectable()
export class AdminService extends RestClientService {

  constructor(private http: Http) {
    super(environment.server, environment.adminapi);
  }


  public getIndex = (type: string): Observable<any[]> => {
    const url: string = this.getUrl('/index/' + type);
    console.log(url);

    console.log('getRecords ' + url);


    return this.http.get(url, this.jwt())
      .map((response: Response) => {
        this.controlResponse(response);
        return <any[]>response.json();
      })
      .catch(this.handleError);
  }


  /**
   * save a record
   */
  public rebuildIndex = (type: string): Observable<any> => {

    // eg : /index/calendar
    const url: string = this.getUrl('/index/' + type);
    console.log(url);

    const postData = 'requestbody={}';

    return this.http.post(url,
      postData,
      this.jwtPost())
      .map((response: Response) => {
        this.controlResponse(response);
        return <any>response.json();
      })
      .catch(this.handleError);

  }




  /**
   * Table metadata for record modification
   */
  public getMetadata = (file: string): Observable<Metadata[]> => {
    let userMetadata: Metadata[] = null;
    if (file === 'users/index/metadata.json') {

      userMetadata = JSON.parse('\
      [\
  	{"name" : "email" , "primary" : "true", "type" : "string",  "editor":"line"},\
    {"name" : "name" , "primary" : "false", "type" : "string",  "editor":"line"},\
    {"name" : "role" , "primary" : "false", "type" : "text",  "editor":"choice", "choices" : ["guest", "editor", "admin"]},\
    {"name" : "password" , "primary" : "true", "type" : "password",  "editor":"line"},\
    {"name" : "status" , "primary" : "false", "type" : "text",  "editor":"choice", "choices" : ["active", "inactive", "changepassword"]}\
      ]\
      ');

    }

    return Observable.of(userMetadata);

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


      const data = 'requestbody=' + JSON.stringify(user);

      return this.http.put(url, data,
                  this.jwtPost())
        .map((response: Response) => {
          this.controlResponse(response);
          return <any>response.json();
        });
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

      const jsonStr = JSON.stringify({
        email: user.email,
        password: user.password,
        name : user.name,
        secretQuestion : user.secretResponse,
        secretResponse : user.secretResponse
      });

    //  const data = 'requestbody=' + jsonStr + '&password=' + user.password;
    const data = 'requestbody=' + jsonStr;


      return this.http.post(url, data,
                  this.jwtPost())
        .map((response: Response) => {
          this.controlResponse(response);
          return <any>response.json();
        });
    }

    }


  public updateUser(type: string, userInput: any): Observable<any> {
  if (type === 'users') {
    const hashUtils = new HashUtils();


    const url: string = this.getUrl('/content/' + type + '/' + userInput.email);
    let data = '';
    if (userInput.password) {

      data = 'requestbody=' + JSON.stringify({ email: userInput.email,
        newpassword: hashUtils.hash64(userInput.password),
        role : userInput.role,
        name : userInput.name
         });

    } else {

      data = 'requestbody=' + JSON.stringify(userInput);

    }


    return this.http.post(url, data,
                this.jwtPost())
      .map((response: Response) => {
        this.controlResponse(response);
        return <any>response.json();
      });
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
          console.log(url);


          return this.http.get(url, this.jwt())
              .map((response: Response) => {
                this.controlResponse(response);
                return <any>response.json();
              })
              .catch(this.handleError);
      }

      /**
       * Table metadata for record modification
       */
      public getNewRecord = (file: string): Observable<any[]> => {
        let userMetadata: Metadata[] = null;
        if (file === 'users/index/new.json') {

          userMetadata = JSON.parse('\
          {\
              "name": "",\
              "email": "",\
              "password": "",\
              "role": ""\
          }\
          ');

        }

        return Observable.of(userMetadata);
      }



  getAll() {
    return this.http.get('/api/users', this.jwt()).map((response: Response) => response.json());
  }

  getById(id: number) {
    return this.http.get('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
  }

  create(user: User) {
    return this.http.post('/api/users', user, this.jwt()).map((response: Response) => response.json());
  }

  update(user: User) {
    return this.http.put('/api/users/' + user.id, user, this.jwt()).map((response: Response) => response.json());
  }

  /**
   * delete a record
   */
  public delete = (type: string, id: string): Observable<any> => {

      // eg : /content/calendar
      const url: string = this.getUrl('/content/' + type + '/' + id);
      console.log(url);


      return this.http.delete(url,
          this.jwt())
          .map((response: Response) => {
            this.controlResponse(response);
            return <any>response.json();
          })
          .catch(this.handleError);

  }
}
