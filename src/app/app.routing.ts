import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from 'src/app/home/index';

import { RegisterComponent } from 'src/app/register/index';
import { RecordListComponent } from 'src/app/recordlist/recordlist.component';
import { RecordComponent } from 'src/app/record/record.component';


import { UserListComponent, UserRecordComponent } from 'src/app/users';
import { UserRouteAccessService } from 'src/app/shared';

import { LoginComponent, ModifyPasswordComponent , SendPasswordDialogComponent } from 'src/app/login';


import { LoginLayoutComponent } from 'src/app/layouts/login-layout.component';

import { AdminMainpageComponent } from 'src/app/admin-mainpage/admin-mainpage.component';


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
