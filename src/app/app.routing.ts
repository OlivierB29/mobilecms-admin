import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';

import { RegisterComponent } from './register/index';
import { AuthGuard } from './_guards/index';
import { RecordListComponent } from 'app/recordlist/recordlist.component';
import { RecordComponent } from 'app/record/record.component';

import { ModifyPasswordComponent } from 'app/modifypassword/modifypassword.component';

import { MainPageComponent } from 'app/mainpage/mainpage.component';

const appRoutes: Routes = [

    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent },
    { path: 'modifypasssword', component: ModifyPasswordComponent, canActivate: [AuthGuard] },
    { path: 'recordlist/:type',  component: RecordListComponent, canActivate: [AuthGuard] },
    { path: 'record/:type/:id',  component: RecordComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });
