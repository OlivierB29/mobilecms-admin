import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from 'app/home/index';

import { RegisterComponent } from 'app/register/index';
import { RecordListComponent } from 'app/recordlist/recordlist.component';
import { RecordComponent } from 'app/record/record.component';


import { UserListComponent, UserRecordComponent } from 'app/users';
import { UserRouteAccessService } from 'app/shared';

import { LoginComponent, ModifyPasswordComponent , SendPasswordDialogComponent } from 'app/login';


import { LoginLayoutComponent } from 'app/layouts/login-layout.component';

import { AdminMainpageComponent } from 'app/admin-mainpage/admin-mainpage.component';


const appRoutes: Routes = [
  {
    path: '',
    component: AdminMainpageComponent,
    canActivate: [UserRouteAccessService],
    children: [
      { path: '', component: HomeComponent, canActivate: [UserRouteAccessService] },
      { path: 'home', component: HomeComponent, canActivate: [UserRouteAccessService] },
      { path: 'recordlist/:type',  component: RecordListComponent, canActivate: [UserRouteAccessService] },
      { path: 'record/:type/:id',  component: RecordComponent, canActivate: [UserRouteAccessService] },
      { path: 'userlist',  component: UserListComponent, canActivate: [UserRouteAccessService] },
      { path: 'userrecord/:id',  component: UserRecordComponent, canActivate: [UserRouteAccessService] }
    ]
  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ]
  },

    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });
