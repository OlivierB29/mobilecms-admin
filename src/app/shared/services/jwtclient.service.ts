import { Injectable } from '@angular/core';

import { User } from 'src/app/_models/index';
import { Metadata } from 'src/app/_models';
import { HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';




export class JwtClientService {


  protected postFormData = environment.postformdata;







  public jwt(): HttpHeaders {
    // create authorization header with jwt token


    if (localStorage.getItem('currentUser')) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser && currentUser.token) {
        return new HttpHeaders ({ 'Authorization': 'Bearer ' + currentUser.token });
      }
    }
    return null;
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





}
