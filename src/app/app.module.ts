// @angular imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
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
import { AlertService, AuthenticationService, UserService, ContentService, UploadService,
   LocaleService, StringUtils } from './_services/index';
import { HomeComponent, HomeHelpDialogComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { RecordListComponent } from 'app/recordlist/index';
import { RecordComponent, EditLinksComponent, EditMediaComponent,
   ErrorDialogComponent, DeleteDialogComponent, RecordHelpDialogComponent } from 'app/record';

import { ModifyPasswordComponent } from 'app/modifypassword';

import { TopMenuComponent } from 'app/topmenu/topmenu.component';
import { MainPageComponent } from 'app/mainpage/mainpage.component';

import {  OrderbyPipe } from './shared/filters';


@NgModule({
  imports: [
    FormsModule,
    HttpModule,
    routing,
    MaterialModule,
    NoopAnimationsModule,
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient]
                }
            })
  ],
  declarations: [

    MainPageComponent,
    AppComponent,
    AlertComponent,
    HomeComponent,
    HomeHelpDialogComponent,
    TopMenuComponent,
    LoginComponent,
    ModifyPasswordComponent,
    RegisterComponent,
    RecordListComponent,
    RecordComponent,
    RecordHelpDialogComponent,
    DeleteDialogComponent,
    OrderbyPipe,
    SlidemenuComponent,
    EditLinksComponent,
    EditMediaComponent,
    ErrorDialogComponent
  ],
  entryComponents: [
    HomeHelpDialogComponent,
    RecordHelpDialogComponent,
    DeleteDialogComponent,
    ErrorDialogComponent
  ],

  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    ContentService,
    UploadService,
    LocaleService,
    StringUtils,
    OrderbyPipe
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
