import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../_models/index';
import { Metadata } from 'app/_models';

import { environment } from '../../environments/environment';


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

    public options = (): Observable<any> => {
        const url: string = this.getUrl('/content');

        console.log('options ' + url);


        return this.http.get(url, this.jwt())
            .map((response: Response) => {
              this.controlResponse(response);
              return <any>response.json();
            })
            .catch(this.handleError);
    }

    /**
     * Get list of tables
     * Response [{"type":"calendar"},{"type":"news"}]
     */
    public getTables = (): Observable<any[]> => {
        const url: string = this.getUrl('/content');

        console.log('getTables ' + url);


        return this.http.get(url, this.jwt())
            .map((response: Response) => {
              this.controlResponse(response);
              return <any[]>response.json();
            })
            .catch(this.handleError);
    }

    /**
     * @arg type : news, calendar, ...
     * Response :
     */
    public getRecords = (type: string): Observable<any[]> => {
        const url: string = this.getUrl('/content/' + type);

        console.log('getRecords ' + url);


        return this.http.get(url, this.jwt())
            .map((response: Response) => {
              this.controlResponse(response);
              return <any[]>response.json();
            })
            .catch(this.handleError);
    }

    /**
     * @arg type : news, calendar, ...
     * Response :
     */
    public getIndex = (type: string): Observable<any[]> => {
      const url: string = this.getUrl('/index/' + type);
      console.log(url);

        console.log('getRecords ' + url);


        return this.http.get(url, this.jwt())
            .map((response: Response) => {
              this.controlResponse(response);
              return <any[]>response.json();
            })
            .catch(this.handleError);
    }

    /**
     * get a single record
     * @arg type : news, calendar, ...
     * @arg id : unique id
     * @returns Observable of a JSON record
     */
    public getRecord = (type: string, id: string): Observable<any> => {
        const url: string = this.getUrl('/content/' + type + '/' + id);
        console.log(url);

        return this.http.get(url, this.jwt())
            .map((response: Response) => {
              this.controlResponse(response);
              return <any>response.json();
            })
            .catch(this.handleError);
    }

    /**
     * save a record
     */
    public post = (type: string, obj: any): Observable<any> => {

        // eg : /content/calendar
        const url: string = this.getUrl('/content/' + type);
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

    /**
     * delete a record
     */
    public delete = (type: string, id: string): Observable<any> => {

        // eg : /content/calendar
        const url: string = this.getUrl('/content/' + type + '/' + id);
        console.log(url);


        return this.http.delete(url,
            this.jwt())
            .map((response: Response) => {
              this.controlResponse(response);
              return <any>response.json();
            })
            .catch(this.handleError);

    }

    /**
     * save a record
     */
    public putObject = (type: string, obj: any): Observable<any> => {

        // eg : /content/calendar
        const url: string = this.getUrl('/content/' + type);
        console.log(url);

        return this.http.put(url,
            obj,
            this.jwtPost())
            .map((response: Response) => {
              this.controlResponse(response);
              return <any>response.json();
            })
            .catch(this.handleError);

    }

    /**
     * save a record
     */
    public rebuildIndex = (type: string): Observable<any> => {

        // eg : /index/calendar
        const url: string = this.getUrl('/index/' + type);
        console.log(url);

        const postData = 'requestbody={}';

        return this.http.post(url,
            postData,
            this.jwtPost())
            .map((response: Response) => {
              this.controlResponse(response);
              return <any>response.json();
            })
            .catch(this.handleError);

    }

    /**
     * Table metadata for record modification
     */
    public getMetadata = (file: string): Observable<Metadata[]> => {

         const url: string = this.getUrl('/file/?file=' + file);

        return this.http.get(url, this.jwt())
            .map((response: Response) => {
              this.controlResponse(response);
              return <Metadata[]>response.json();
            })
            .catch(this.handleError);
    }

    /**
     * Table metadata for record modification
     */
    public getNewRecord = (file: string): Observable<any[]> => {

        const url: string = this.getUrl('/file/?file=' + file);
        return this.http.get(url, this.jwt())
            .map((response: Response) => <Metadata[]>response.json())
            .catch(this.handleError);
    }

    public controlResponse = (response: Response): void => {
      if (response.status < 200 || response.status >= 300) {
        throw new Error('This request has failed ' + response.status);
      }
    }

/**

      response => {
    // If request fails, throw an Error that will be caught
    if(response.status < 200 || response.status >= 300) {
      throw new Error('This request has failed ' + response.status);
    }
    // If everything went fine, return the response
    else {
      return <Metadata[]>response.json();
    }

*/

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

    private handleError(error: Response) {
        // console.error('handleError ' + JSON.stringify(error));
        // return Observable.throw(error.json().error || 'Server error');
        return Observable.throw( 'Server error');
    }

    private escape(text: string): string {

    return text.replace(/[\\]/g, '\\\\')
    .replace(/[\"]/g, '\\\"')
    .replace(/[\/]/g, '\\/')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t');

    }

}
