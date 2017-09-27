import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { JwtClientService } from '../services';
import { CommonClientService } from '../services';

@Injectable()
export class UserRouteAccessService implements CanActivate {

  private options: any;



  constructor(private router: Router, private contentService: CommonClientService, private http: HttpClient) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean>|Promise<boolean>|boolean  {
    if (localStorage.getItem('currentUser')) {
      this.contentService.init(environment.server, environment.api);
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
