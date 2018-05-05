import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { JwtClientService } from '../services';
import { CommonClientService } from '../services';
import { HttpResponse } from '@angular/common/http';




@Injectable()
export class UserRouteAccessService implements CanActivate {


  constructor(private router: Router, private contentService: CommonClientService, private http: HttpClient) {

  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {


    if (localStorage.getItem('currentUser')) {
      this.contentService.init(environment.server, environment.api);

      return this.getAuthenticatedResponse().pipe(
        map(resp => {
          if (resp.body) {
            return true;
          } else {
            this.router.navigate(['/login']);
            return false;
          }
        })
      );

    } else {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
      return false;
    }
  }


  private authorize(id: string): boolean {
    return true;
  }

  private getAuthenticatedResponse(): Observable<HttpResponse<boolean>> {
    const url: string = this.contentService.getUrl('/content');
    return this.http.get<boolean>(
      url, { headers: this.contentService.jwt(), observe: 'response' });
  }

}
