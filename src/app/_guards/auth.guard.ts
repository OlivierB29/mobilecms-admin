import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ContentService } from 'app/_services';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {

  private options: any;



  constructor(private router: Router, private contentService: ContentService) {}



  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean  {

    // check authentication token
    return this.contentService.options().map(data => {
            if (data) {
                console.log('authenticated');
                return true;
            }
            console.log('not authenticated');
            return false;
        });

  }
}
