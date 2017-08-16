import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from 'app/_models/index';
import { Metadata } from 'app/_models';




export abstract class RestClientService {


  protected postFormData = true;



  constructor(private serverUrl: string, private api: string) {

  }


  /**
  * get API url
  * @arg path  eg : '/content'
  * @returns http://server//adminapp/api.php?path=/content
  */
  protected getUrl(path: string): string {
    return this.serverUrl + this.api + path;
  }


  // private helper methods

  protected jwt(): RequestOptions {
    // create authorization header with jwt token


    if (localStorage.getItem('currentUser')) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser && currentUser.token) {

        const headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
        return new RequestOptions({ headers: headers });
      } else {
        throw new Error('invalid token');
      }
    } else {
      throw new Error('empty user');
    }

  }

  protected jwtPost(): RequestOptions {
    // create authorization header with jwt token
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {

      const headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });

      // for POST
      if (this.postFormData) {
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      } else {
        headers.append('Content-Type', 'application/json; charset=UTF-8');
      }


      return new RequestOptions({ headers: headers });
    } else {
      throw new Error('empty user');
    }
  }

  public controlResponse = (response: Response): void => {
    if (response.status < 200 || response.status >= 300) {
      throw new Error('This request has failed ' + response.status);
    }
  }


  protected handleError(error: Response) {
    // console.error('handleError ' + JSON.stringify(error));
    // return Observable.throw(error.json().error || 'Server error');
    return Observable.throw('Server error');
  }


}
