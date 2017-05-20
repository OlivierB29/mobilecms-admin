import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { AuthGuard } from './_guards/index';
import { RecordListComponent } from 'app/recordlist/recordlist.component';
import { RecordComponent } from 'app/record/record.component';

import { ModifyPasswordComponent } from 'app/modifypassword/modifypassword.component';

import { MainPageComponent } from 'app/mainpage/mainpage.component';

const appRoutes: Routes = [

    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'modifypasssword', component: ModifyPasswordComponent },
    { path: 'recordlist/:type',  component: RecordListComponent, canActivate: [AuthGuard] },
    { path: 'record/:type/:id',  component: RecordComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });
