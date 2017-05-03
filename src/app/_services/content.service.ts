import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../_models/index';

@Injectable()
export class ContentService {

    /**
    * server base admin API app
    */
    private serverUrl = 'http://localhost/adminapp';

    /**
    * API endpoint
    */
    private api = '/api/v1/api.php?path=';

    constructor(private http: Http) { }

    /**
    * get API url
    * @path eg : '/api/v1/content'
    */
    private getUrl(path : string) : string {
      return this.serverUrl + this.api + path;
    }


        public getTables = (): Observable<any[]> => {
            var url : string = this.getUrl('/api/v1/content');

            console.log('getTables ' + url);


            return this.http.get(url, this.jwt())
                .map((response: Response) => <any[]>response.json())
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
