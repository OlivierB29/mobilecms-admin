import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from 'app/home/index';

import { RegisterComponent } from 'app/register/index';
import { RecordListComponent } from 'app/recordlist/recordlist.component';
import { RecordComponent } from 'app/record/record.component';

import { MainPageComponent } from 'app/mainpage/mainpage.component';
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
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'recordlist/:type',  component: RecordListComponent },
      { path: 'record/:type/:id',  component: RecordComponent },
      { path: 'userlist',  component: UserListComponent },
      { path: 'userrecord/:id',  component: UserRecordComponent }
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
