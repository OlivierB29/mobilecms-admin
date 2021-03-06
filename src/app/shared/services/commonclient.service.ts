import { Injectable } from '@angular/core';

import { User } from 'src/app/_models/index';
import { Metadata } from 'src/app/_models';
import { HttpHeaders } from '@angular/common/http';

import { JwtClientService } from './jwtclient.service';
import { environment } from 'src/environments/environment';


export class CommonClientService extends JwtClientService {


  protected postFormData = environment.postformdata;

  private serverUrl = '';
  private api = '';


  public init(server: string, api: string) {
    this.serverUrl = server;
    this.api = api;
  }

  /**
  * get API url
  * @arg path  eg : '/foobar'
  * @returns http://server/adminapp/apiname/foobar
  */
  public getUrl(path: string): string {
    return this.serverUrl + this.api + path;
  }


  public controlResponse = (response: Response): void => {
    if (response.status < 200 || response.status >= 300) {
      throw new Error('This request has failed ' + response.status);
    }
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
    return obj;
  }

}
