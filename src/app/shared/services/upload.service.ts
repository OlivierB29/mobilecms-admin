import { Injectable } from '@angular/core';



import { User } from 'app/_models/index';

import { environment } from 'environments/environment';
import { CommonClientService } from './commonclient.service';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Log } from './log.service';


@Injectable()
export class UploadService extends CommonClientService {


  constructor(private log: Log, private http: HttpClient) {
    super();
    this.init(environment.server, environment.fileapi);
  }




  public getFilesDescriptions(type: string, id: string): Observable<any[]> {
    const url = this.getUrl('/basicupload/' + type + '/' + id);

    this.log.debug('getFilesDescriptions ' + url);

    return this.http.get<any[]>(url, { headers: this.jwt() });
  }

  public uploadFile(file: any, type: string, id: string): Promise<any[]> {
    const url = this.getUrl('/basicupload/' + type + '/' + id);

    return new Promise((resolve, reject) => {
      const formData: any = new FormData()
      const xhr = new XMLHttpRequest()


      formData.append('uploaded_file', file);
      xhr.onreadystatechange = function () {
        console.log('onreadystatechange ...');
        if (xhr.readyState === 4) {
          console.log('onreadystatechange readyState');
          if (xhr.status === 200) {
            console.log('onreadystatechange status 200');
            resolve(JSON.parse(xhr.response));
          } else {
            console.log('onreadystatechange reject');
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url, true);

      // create authorization header with jwt token
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser && currentUser.token) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + currentUser.token);
      } else {
        throw new Error('empty user');
      }
      xhr.send(formData);
    });
  }

  public sync(type: string, id: string, obj: any): Observable<any> {

    // eg : /content/calendar
    const url = this.getUrl('/download/' + type + '/' + id);

    this.log.debug(url);


    let postData = '';
    if (this.postFormData) {
      // escape issue, with some characters like &
      postData = 'requestbody=' + encodeURIComponent(JSON.stringify(JSON.parse(JSON.stringify(obj))));
    } else {
      postData = obj;
    }

    return this.http.post<any>(url,
      postData,
      { headers: this.jwtPost() });

  }

  public thumbnails(type: string, id: string, obj: any): Observable<any> {

    // eg : /content/calendar
    const url = this.getUrl('/thumbnails/' + type + '/' + id);

    this.log.debug(url);


    let postData = '';
    if (this.postFormData) {
      // escape issue, with some characters like &
      postData = 'requestbody=' + encodeURIComponent(JSON.stringify(JSON.parse(JSON.stringify(obj))));
    } else {
      postData = obj;
    }

    return this.http.post<any>(url,
      postData,
      { headers: this.jwtPost() });

  }

  public delete(type: string, id: string, obj: any): Observable<any> {

    // eg : /content/calendar
    const url = this.getUrl('/delete/' + type + '/' + id);

    this.log.debug(url);


    let postData = null;
    if (this.postFormData) {
      // escape issue, with some characters like &
      postData = 'requestbody=' + encodeURIComponent(JSON.stringify(JSON.parse(JSON.stringify(obj))));
    } else {
      postData = obj;
    }

    return this.http.post<any>(url,
      postData,
      { headers: this.jwtPost() });

  }


}
