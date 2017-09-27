import { Injectable } from '@angular/core';

import { User } from 'app/_models/index';
import { Metadata } from 'app/_models';
import { HttpHeaders } from '@angular/common/http';

import { JwtClientService } from './jwtclient.service';




export class CommonClientService extends JwtClientService {


  protected postFormData = false;

  private serverUrl: string;
  private api: string;

  constructor() {
    super();
  }

  public init(server: string, api: string) {
    this.serverUrl = server;
    this.api = api;
  }

  /**
  * get API url
  * @arg path  eg : '/content'
  * @returns http://server//adminapp/api.php?path=/content
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
      data = this.getRequestBody(obj)
    } else {
      data = obj;
    }
    return obj;
  }

}
