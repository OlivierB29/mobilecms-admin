import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { User } from 'app/_models/index';

import { environment } from '../../environments/environment';
import { CommonClientService } from './commonclient.service';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class UploadService extends CommonClientService {


    constructor(private http: HttpClient) {
      super( environment.server, environment.fileapi);
     }




    public getFilesDescriptions(type: string, id: string): Observable<any[]> {
      const url = this.getUrl('/basicupload/' + type + '/' + id);

        console.log('getFilesDescriptions ' + url);

        return this.http.get<any[]>(url, {headers: this.jwt()});
    }

    public uploadFile(file: any, type: string, id: string): Observable<any[]> {
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

    public sync(type: string, id: string, obj: any): Observable<any> {

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

        return this.http.post<any>(url,
            postData,
            {headers: this.jwtPost()});

    }

    public delete(type: string, id: string, obj: any): Observable<any> {

        // eg : /content/calendar
        const url = this.getUrl('/delete/' + type + '/' + id);

        console.log(url);


         let postData = '';
         if (this.postFormData) {
           // escape issue, with some characters like &
           postData = 'requestbody=' + encodeURIComponent(JSON.stringify(JSON.parse(JSON.stringify(obj))));
         } else {
           postData = JSON.stringify(obj);
         }

        return this.http.post<any>(url,
            postData,
            {headers: this.jwtPost()});

    }


}
