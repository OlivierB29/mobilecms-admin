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

import { TopMenuComponent } from 'app/topmenu/topmenu.component';

// Material Theme
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import 'hammerjs';

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
        AppComponent,
        AlertComponent,
        HomeComponent,
        TopMenuComponent,
        LoginComponent,
        RegisterComponent,
        RecordListComponent,
        RecordComponent
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
