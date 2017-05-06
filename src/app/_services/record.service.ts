import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../_models/index';
import { Metadata } from 'app/_models';

//Merge ?
@Injectable()
export class RecordService {

    /**
    * server base admin API app
    */
    private serverUrl = 'http://localhost';
    private resourcesUrl = 'assets';

    /**
    * API endpoint
    */
    private api = '/adminapp/api/v1/api.php?path=';

    constructor(private http: Http) { }

    /**
    * get API url
    * @arg path  eg : '/api/v1/content'
    * @returns http://localhost//adminapp/api/v1/api.php?path=/api/v1/content
    */
    private getUrl(path: string): string {
        return this.serverUrl + this.api + path;
    }

    /**
     * Get list of tables
     * Response [{"type":"calendar"},{"type":"news"}]
     */
    public getTables = (): Observable<any[]> => {
        var url: string = this.getUrl('/api/v1/content');

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
        var url: string = this.getUrl('/api/v1/content/' + type);

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
        var url: string = this.resourcesUrl + '/public/' + type + '/' + id + '.json';
     
        return this.http.get(url)
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    

    /**
     * Table metadata for record modification
     */
    public getMetadata = (file: string): Observable<Metadata[]> => {
        return this.http.get(this.resourcesUrl + file)
            .map((response: Response) => <Metadata[]>response.json())
            .catch(this.handleError);
    }


    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {

            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }

    private handleError(error: Response) {
        console.error('handleError ' + error.statusText);
        return Observable.throw(error.json().error || 'Server error');
    }

}
