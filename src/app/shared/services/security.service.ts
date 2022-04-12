import { Injectable } from '@angular/core';

import { User } from 'src/app/_models/index';
import { Metadata } from 'src/app/_models';

import { environment } from 'src/environments/environment';
import { CommonClientService } from './commonclient.service';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Log } from './log.service';
import { Router } from '@angular/router';



@Injectable()
export class SecurityService extends CommonClientService {


    constructor(private log: Log, private http: HttpClient, private router: Router) {
      super();
      this.init( environment.server, environment.apiuri + '/cmsapi');
     }

    public isAuthenticated():  Observable<boolean> | boolean  {
        if (this.getUser()) {
            return this.http.get<boolean>(this.getUrl('/status'),
            { headers: this.jwt(), observe: 'response' })
             .pipe(map((res: any) => {
                 if (res) {
                   return true;
                 } else {
                   console.error('response ????');

                   return false;
                 }
             }),
             catchError(err => {
               console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ' + err.status);

               return of(false);
             })
           );
        } else {
            return false;
        }
            

    }

    public verifyAuthenticated():  Observable<boolean> | boolean  {
            return this.http.get<boolean>(this.getUrl('/status'),
            { headers: this.jwt(), observe: 'response' })
             .pipe(map((res: any) => {
                 if (res) {
                   return true;
                 } else {
                   console.error('response ????');
                   this.router.navigate(['/login']);
                   return false;
                 }
             }),
             catchError(err => {
               console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ' + err.status);
               this.router.navigate(['/login']);
               localStorage.removeItem('currentUser');
               return of(false);
             })
           );
    }

    public getUser(): any {
      let currentUser : any;
      const currentUserLocalStorage = localStorage.getItem('currentUser');
      if (currentUserLocalStorage) {
        currentUser = JSON.parse(currentUserLocalStorage);
      }
      return currentUser;
    }

    public isConnected(): Observable<boolean> | boolean {
        let result = false;
        const currentUser = this.getUser();
        if (currentUser) {
            const hasRole = currentUser.role === 'editor' || currentUser.role === 'admin';
            result = this.isAuthenticated() && hasRole && !this.isNewPasswordRequired();
        }
        return result;
      }


      public isNewPasswordRequired(): boolean {
        const currentUser = this.getUser();
        return currentUser && currentUser.newpasswordrequired === 'true';
      }

      public isAdminRole(): boolean {
        let result = false;
        const currentUser = this.getUser();
        if (currentUser) {
            result = currentUser.role === 'admin';
        }
        return result;
    }
    public hasRole(): boolean {
        let result = false;
        const currentUser = this.getUser();
        if (currentUser) {
            result = currentUser.role === 'editor' || currentUser.role === 'admin';
        }
        return result;
    }


}
