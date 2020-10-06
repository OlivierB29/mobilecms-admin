import { Injectable } from '@angular/core';

import { User } from 'src/app/_models/index';
import { Metadata } from 'src/app/_models';

import { environment } from 'src/environments/environment';
import { CommonClientService } from './commonclient.service';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Log } from './log.service';



@Injectable()
export class ContentService extends CommonClientService {


    constructor(private log: Log, private http: HttpClient) {
      super();
      this.init( environment.server, environment.api);
     }

    public options = (): Observable<any> => {

        const url: string = this.getUrl('/content');
        const h = new HttpHeaders();
        return this.http.get<any>(url, {headers: this.jwt()});
    }




    /**
     * Get list of tables
     * Response [{"type":"calendar"},{"type":"news"}]
     */
    public getTables = (): Observable<any[]> => {

        const url: string = this.getUrl('/content');

        this.log.debug('getTables ' + url);

        return this.http.get<any[]>(url, {headers: this.jwt()});
    }

    /**
     * @arg type : news, calendar, ...
     * Response :
     */
    public getRecords = (type: string): Observable<any[]> => {
        const url: string = this.getUrl('/content/' + type);

        this.log.debug('getRecords ' + url);

          return  this.http.get<any>(url, {headers: this.jwt()});
    }

    /**
     * @arg type : news, calendar, ...
     * Response :
     */
    public getIndex = (type: string): Observable<any> => {
      const url: string = this.getUrl('/index/' + type) + this.getTimestampReques();
        this.log.debug('getIndex ' + url);


        return this.http.get(url, {headers: this.jwt()});
    }

    public getTimestampReques(): string {

        return '?timestamp=' + Date.now().toString();
    }

    /**
     * get a single record
     * @arg type : news, calendar, ...
     * @arg id : unique id
     * @returns Observable of a JSON record
     */
    public getRecord = (type: string, id: string): Observable<any> => {
        const url: string = this.getUrl('/content/' + type + '/' + id ) + this.getTimestampReques();
        this.log.debug(url);

        return this.http.get<any>(url, {headers: this.jwt()});
    }

    /**
     * save a record
     */
    public post = (type: string, obj: any): Observable<any> => {

        // eg : /content/calendar
        const url: string = this.getUrl('/content/' + type);
        this.log.debug(url);


         let postData: any;
         if (this.postFormData) {
           // escape issue, with some characters like &
           postData = 'requestbody=' + encodeURIComponent(JSON.stringify(JSON.parse(JSON.stringify(obj))));
         } else {
           postData = obj;
         }

        return this.http.post(url,
            postData,
             {headers: this.jwtPost()});

    }

    /**
     * delete a record
     */
    public delete = (type: string, id: string): Observable<any> => {

        // eg : /content/calendar
        const url: string = this.getUrl('/content/' + type + '/' + id);
        this.log.debug(url);


        return this.http.delete<any>(url, {headers: this.jwt()});

    }

    /**
     * save a record
     */
    public putObject = (type: string, obj: any): Observable<any> => {

        // eg : /content/calendar
        const url: string = this.getUrl('/content/' + type);
        this.log.debug(url);

        return this.http.put(url, obj, {headers: this.jwtPost()});

    }

    /**
     * save a record
     */
    public rebuildIndex = (type: string): Observable<any> => {

        // eg : /index/calendar
        const url: string = this.getUrl('/index/' + type);
        this.log.debug(url);

        const postData = 'requestbody={}';

        return this.http.post<any>(url,
            postData,
            {headers: this.jwtPost()});

    }

        /**
     * save a record
     */
    public deleteRecordList = (type: string, obj: any): Observable<any> => {

        // eg : /index/calendar
        const url: string = this.getUrl('/deletelist/' + type);
        this.log.debug(url);

        const postData = obj;

        return this.http.post<any>(url,
            postData,
            {headers: this.jwtPost()});

    }

    /**
     * Table metadata for record modification
     */
    public getMetadata = (type: string): Observable<Metadata[]> => {

         const url: string = this.getUrl('/metadata/' + type);

        return this.http.get<Metadata[]>(url, {headers: this.jwt()});
    }

    /**
     * Table metadata for record modification
     */
    public getNewRecord = (type: string): Observable<any[]> => {

        const url: string = this.getUrl('/template/' + type);
        return this.http.get<Metadata[]>(url, {headers: this.jwt()});
    }




}
