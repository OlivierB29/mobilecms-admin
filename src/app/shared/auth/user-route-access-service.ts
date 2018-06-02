import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


import { environment } from 'environments/environment';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { SecurityService } from '../services/security.service';



@Injectable()
export class UserRouteAccessService implements CanActivate {


  constructor(private router: Router, private service: SecurityService, private http: HttpClient) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    console.log('canActivate');
    if (this.service.getUser()) {
        return this.service.verifyAuthenticated();
    } else {
          this.router.navigate(['/login']);
          return false;
    }
    
  }
}