import { Injectable } from '@angular/core';

import { User } from 'app/_models/index';
import { Metadata } from 'app/_models';
import { HttpHeaders } from '@angular/common/http';




export abstract class CommonClientService {


  protected postFormData = false;



  constructor(private serverUrl: string, private api: string) {

  }


  /**
  * get API url
  * @arg path  eg : '/content'
  * @returns http://server//adminapp/api.php?path=/content
  */
  public getUrl(path: string): string {
    return this.serverUrl + this.api + path;
  }




  public jwt(): HttpHeaders {
    // create authorization header with jwt token


    if (localStorage.getItem('currentUser')) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser && currentUser.token) {
        return new HttpHeaders ({ 'Authorization': 'Bearer ' + currentUser.token });
      } else {
        throw new Error('invalid token');
      }
    } else {
      throw new Error('empty user');
    }

  }

  public jwtPost(): HttpHeaders {
    // create authorization header with jwt token
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {

      let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + currentUser.token });

      // for POST
      // https://stackoverflow.com/questions/45286764/angular-4-3-httpclient-doesnt-send-header
      if (this.postFormData) {
        headers = headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      } else {
        headers = headers.append('Content-Type', 'application/json; charset=UTF-8');
      }


      return headers;
    } else {
      throw new Error('empty user');
    }
  }

  public controlResponse = (response: Response): void => {
    if (response.status < 200 || response.status >= 300) {
      throw new Error('This request has failed ' + response.status);
    }
  }

  protected getRequestBody(obj: any) {
    let data = null;
    if (this.postFormData) {
      data = this.getRequestBody(obj)
    } else {
      data = obj;
    }
    return obj;
  }

}
