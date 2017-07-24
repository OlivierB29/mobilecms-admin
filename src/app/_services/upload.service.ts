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


    constructor(private http: Http) { }

    /**
    * get API url
    * @arg path  eg : '/content'
    * @returns http://server//adminapp/api.php?path=/content
    */
    private getUrl(path: string): string {
        return this.serverUrl + this.api + path;
    }


    uploadFile(file: any, type: string, id: string): Observable<any[]> {
      const url = this.getUrl('/basicupload/' + type + '/' + id);

        return Observable.fromPromise(new Promise((resolve, reject) => {
            const formData: any = new FormData()
            const xhr = new XMLHttpRequest()


            formData.append('uploaded_file', file);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response))
                    } else {
                        reject(xhr.response)
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



}
