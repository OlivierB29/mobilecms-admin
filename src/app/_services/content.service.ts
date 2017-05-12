import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../_models/index';
import { Metadata } from 'app/_models';

import { environment } from '../environment';


@Injectable()
export class ContentService {

    /**
    * server base admin API app
    */
    private serverUrl = environment.server;


    /**
    * API endpoint
    */
    private api = environment.api;


    constructor(private http: Http) { }

    /**
    * get API url
    * @arg path  eg : '/api/v1/content'
    * @returns http://server//adminapp/api/v1/api.php?path=/api/v1/content
    */
    private getUrl(path: string): string {
        return this.serverUrl + this.api + path;
    }

    /**
     * Get list of tables
     * Response [{"type":"calendar"},{"type":"news"}]
     */
    public getTables = (): Observable<any[]> => {
        const url: string = this.getUrl('/api/v1/content');

        console.log('getTables ' + url);


        return this.http.get(url, this.jwt())
            .map((response: Response) => <any[]>response.json())
            .catch(this.handleError);
    }

    /**
     * @arg type : news, calendar, ...
     * Response :
     */
    public getRecords = (type: string): Observable<any[]> => {
        const url: string = this.getUrl('/api/v1/content/' + type);

        console.log('getRecords ' + url);


        return this.http.get(url, this.jwt())
            .map((response: Response) => <any[]>response.json())
            .catch(this.handleError);
    }

    /**
     * get a single record
     * @arg type : news, calendar, ...
     * @arg id : unique id
     * @returns Observable of a JSON record
     */
    public getRecord = (type: string, id: string): Observable<any> => {
        const url: string = this.getUrl('/api/v1/content/' + type + '/' + id);
        console.log(url);

        return this.http.get(url, this.jwt())
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    /**
     * save a record
     */
    public post = (type: string, obj: any): Observable<any> => {

        // eg : /api/v1/content/calendar
        const url: string = this.getUrl('/api/v1/content/' + type);
        console.log(url);

        const postData: string = 'requestbody=' + JSON.stringify(obj);

        console.log(postData);

        return this.http.post(url,
            postData,
            this.jwtPost())
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);

    }


    /**
     * Table metadata for record modification
     */
    public getMetadata = (file: string): Observable<Metadata[]> => {

        const url: string = this.getUrl('/api/v1/file&file=' + file);
        return this.http.get(url, this.jwt())
            .map((response: Response) => <Metadata[]>response.json())
            .catch(this.handleError);
    }

    /**
     * Table metadata for record modification
     */
    public getNewRecord = (file: string): Observable<any[]> => {

        const url: string = this.getUrl('/api/v1/file&file=' + file);
        return this.http.get(url, this.jwt())
            .map((response: Response) => <Metadata[]>response.json())
            .catch(this.handleError);
    }


    // private helper methods

    private jwt() {
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

    private jwtPost() {
        // create authorization header with jwt token
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {

            const headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });

            // for POST
            headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

            return new RequestOptions({ headers: headers });
        }
    }

    private handleError(error: Response) {
        console.error('handleError ' + JSON.stringify(error));
        return Observable.throw(error.json().error || 'Server error');
    }

}
