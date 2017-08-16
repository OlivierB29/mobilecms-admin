import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from 'app/_models/index';
import { Metadata } from 'app/_models';

import { environment } from '../../environments/environment';

import { RestClientService } from './restclient.service';

@Injectable()
export class ContentService extends RestClientService {


    constructor(private http: Http) {
      super( environment.server, environment.api);
     }

    public options = (): Observable<any> => {
        const url: string = this.getUrl('/content');
        return this.http.get(url, this.jwt())
            .map((response: Response) => {
              this.controlResponse(response);
              return <any>response.json();
            })
            .catch(() => {
              return Observable.of('');
            });
    }




    getTables2() {
      const url: string = this.getUrl('/content');

        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
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




}
