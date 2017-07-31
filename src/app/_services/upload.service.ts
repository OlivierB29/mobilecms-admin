import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { User } from '../_models/index';

import { environment } from '../../environments/environment';


@Injectable()
export class UploadService {

    /**
    * server base admin API app
    */
    private serverUrl = environment.server;


    /**
    * API endpoint
    */
    private api = environment.fileapi;

    private postFormData = true;



    constructor(private http: Http) { }

    /**
    * get API url
    * @arg path  eg : '/content'
    * @returns http://server//adminapp/api.php?path=/content
    */
    private getUrl(path: string): string {
        return this.serverUrl + this.api + path;
    }

    getFilesDescriptions(type: string, id: string): Observable<any[]> {
      const url = this.getUrl('/basicupload/' + type + '/' + id);

        console.log('getFilesDescriptions ' + url);

        return this.http.get(url, this.jwt())
            .map((response: Response) => {
              this.controlResponse(response);
              return <any[]>response.json();
            })
            .catch(this.handleError);
    }

    uploadFile(file: any, type: string, id: string): Observable<any[]> {
      const url = this.getUrl('/basicupload/' + type + '/' + id);

        return Observable.fromPromise(new Promise((resolve, reject) => {
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
        }));
    }

    public sync = (type: string, id: string, obj: any): Observable<any> => {

        // eg : /content/calendar
        const url = this.getUrl('/download/' + type + '/' + id);

        console.log(url);


         let postData = '';
         if (this.postFormData) {
           // escape issue, with some characters like &
           postData = 'requestbody=' + encodeURIComponent(JSON.stringify(JSON.parse(JSON.stringify(obj))));
         } else {
           postData = JSON.stringify(obj);
         }

        return this.http.post(url,
            postData,
            this.jwtPost())
            .map((response: Response) => {
              this.controlResponse(response);
              return <any>response.json();
            })
            .catch(this.handleError);

    }

    public controlResponse = (response: Response): void => {
      if (response.status < 200 || response.status >= 300) {
        throw new Error('This request has failed ' + response.status);
      }
    }

    private handleError(error: Response) {
        // console.error('handleError ' + JSON.stringify(error));
        // return Observable.throw(error.json().error || 'Server error');
        return Observable.throw( 'Server error');
    }

        private jwtPost(): RequestOptions {
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

        private jwt(): RequestOptions {
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

}
