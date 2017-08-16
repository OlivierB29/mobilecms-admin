import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from 'app/home/index';

import { RegisterComponent } from 'app/register/index';
import { AuthGuard } from 'app/_guards/index';
import { RecordListComponent } from 'app/recordlist/recordlist.component';
import { RecordComponent } from 'app/record/record.component';

import { ModifyPasswordComponent } from 'app/modifypassword/modifypassword.component';

import { MainPageComponent } from 'app/mainpage/mainpage.component';
import { UserListComponent, UserRecordComponent } from 'app/users';

const appRoutes: Routes = [

    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: '', component: HomeComponent, canActivate: [AuthGuard]  },
    { path: 'login', component: HomeComponent },
    { path: 'modifypasssword', component: ModifyPasswordComponent, canActivate: [AuthGuard] },
    { path: 'recordlist/:type',  component: RecordListComponent, canActivate: [AuthGuard] },
    { path: 'record/:type/:id',  component: RecordComponent, canActivate: [AuthGuard] },
    { path: 'userlist',  component: UserListComponent, canActivate: [AuthGuard] },
    { path: 'userrecord/:id',  component: UserRecordComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
