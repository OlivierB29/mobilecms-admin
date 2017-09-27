import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from 'app/home/index';

import { RegisterComponent } from 'app/register/index';
import { RecordListComponent } from 'app/recordlist/recordlist.component';
import { RecordComponent } from 'app/record/record.component';

import { MainPageComponent } from 'app/mainpage/mainpage.component';
import { UserListComponent, UserRecordComponent } from 'app/users';
import { UserRouteAccessService } from 'app/shared';

const appRoutes: Routes = [

    { path: 'home', component: HomeComponent, canActivate: [UserRouteAccessService] },
    { path: '', component: HomeComponent, canActivate: [UserRouteAccessService]  },
    { path: 'login', component: HomeComponent },
    { path: 'login/:algo', component: HomeComponent },
    { path: 'recordlist/:type',  component: RecordListComponent, canActivate: [UserRouteAccessService] },
    { path: 'record/:type/:id',  component: RecordComponent, canActivate: [UserRouteAccessService] },
    { path: 'userlist',  component: UserListComponent, canActivate: [UserRouteAccessService] },
    { path: 'userrecord/:id',  component: UserRecordComponent, canActivate: [UserRouteAccessService] },
    { path: 'register', component: RegisterComponent, canActivate: [UserRouteAccessService] },
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });
