import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ContentService } from 'app/_services';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {

  private options: any;



  constructor(private router: Router, private contentService: ContentService) {}



  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean>|Promise<boolean>|boolean  {
    if (localStorage.getItem('currentUser')) {
      // check authentication token
      return this.contentService.options().map(data => {
              if (data) {
                  return true;
              }
              this.logout();
              return false;
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
