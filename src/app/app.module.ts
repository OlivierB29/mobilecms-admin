import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';



import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { AlertService, AuthenticationService, UserService, ContentService, LocaleService} from './_services/index';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { RecordListComponent } from 'app/recordlist/index';
import { RecordComponent } from 'app/record/record.component';
import { ModifyPasswordComponent } from 'app/modifypassword';

import { TopMenuComponent } from 'app/topmenu/topmenu.component';
import { MainPageComponent } from 'app/mainpage/mainpage.component';

// Material Theme
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import 'hammerjs';
import { SlidemenuComponent } from './slidemenu/slidemenu.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        MaterialModule,
        NoopAnimationsModule
    ],
    declarations: [

        MainPageComponent,
        AppComponent,
        AlertComponent,
        HomeComponent,
        TopMenuComponent,
        LoginComponent,
        ModifyPasswordComponent,
        RegisterComponent,
        RecordListComponent,
        RecordComponent,
        SlidemenuComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        ContentService,
        LocaleService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
