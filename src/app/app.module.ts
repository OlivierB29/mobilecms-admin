// @angular imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';

// translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
  // add './' for targeting local app directory
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


// Material Theme
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import 'hammerjs';

// project imports
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { SlidemenuComponent } from './slidemenu/slidemenu.component';
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

import {  OrderbyPipe } from './shared/filters';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    MaterialModule,
    NoopAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    })
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
    OrderbyPipe,
    SlidemenuComponent
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    ContentService,
    LocaleService,
    OrderbyPipe
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
