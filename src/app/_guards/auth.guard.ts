import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ContentService } from 'app/_services';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthGuard implements CanActivate {

  private options: any;



  constructor(private router: Router, private contentService: ContentService, private http: HttpClient) {}




  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean>|Promise<boolean>|boolean  {
    if (localStorage.getItem('currentUser')) {

      const url: string = this.contentService.getUrl('/content');

      return this.http.get<boolean>(url, {headers: this.contentService.jwt()}).map( data => {
        return data ? true : false;
     });


    } else {

        this.logout();
      return false;
    }
  }

  private logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

}
