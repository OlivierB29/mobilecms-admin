// @angular imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

// translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
      return new TranslateHttpLoader(http, 'assets/i18n-admin/', '.json');
}


// Material
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { MyMaterialModule } from 'app/mymaterial.module';

// project imports
import { routing } from './app.routing';
import { AppComponent } from 'app/app.component';

import { AlertComponent } from 'app/_directives/index';
// import { AuthGuard } from 'app/_guards/index';
import { AdminService, ContentService, UploadService} from 'app/shared/services';
import { HomeComponent, HomeHelpDialogComponent } from './home';

import { RegisterComponent } from 'app/register/index';
import { RecordListComponent, RecordListHelpDialogComponent } from 'app/recordlist/index';
import { UserListComponent, DeleteUserDialogComponent, UserRecordComponent } from 'app/users';
import { RecordComponent,
LinkComponent,
  MediaComponent,
  EditLinksComponent,
  EditMediaComponent,
  ErrorDialogComponent, DeleteDialogComponent, RecordHelpDialogComponent } from 'app/record';

import { LoginComponent, ModifyPasswordComponent , SendPasswordDialogComponent } from 'app/login';

import { MenubuttonComponent } from 'app/mainpage';

import { OrderbyPipe } from 'app/shared/filters';



// @angular/common/http
import { MockHttpInterceptor } from 'app/_helpers/mock-http.interceptor';

import { environment } from 'environments/environment';
import { AdminCmsSharedModule } from 'app/shared/shared.module';

import { AdminMainpageComponent } from 'app/admin-mainpage/admin-mainpage.component';


import { LoginLayoutComponent } from 'app/layouts/login-layout.component';



const providers: any[] = [
  AdminService,
  ContentService,
  UploadService,
  HttpClient

  // TODO uncomment to enable demo
/*
  ,
  {
      provide: HTTP_INTERCEPTORS,
      useClass: MockHttpInterceptor,
      multi: true
  }
  */
];


// broken since angular 6
// if (environment.usemockbackend === true) {
//     console.log('usemockbackend !!!');
//     providers.push({
//         provide: HTTP_INTERCEPTORS,
//         useClass: MockHttpInterceptor,
//         multi: true
//     });
// }


@NgModule({
  imports: [
    FormsModule,
    routing,
    BrowserModule,
    HttpClientModule,
    NoopAnimationsModule,
    MyMaterialModule,
    TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient]
                }
            }),
  AdminCmsSharedModule
  ],
  declarations: [
    LoginLayoutComponent,
    AdminMainpageComponent,
    SendPasswordDialogComponent,
    MenubuttonComponent,
    AppComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    HomeHelpDialogComponent,
    ModifyPasswordComponent,
    RegisterComponent,
    RecordListComponent,
    RecordListHelpDialogComponent,
    RecordComponent,
    UserListComponent,
    UserRecordComponent,
    RecordHelpDialogComponent,
    DeleteDialogComponent,
    DeleteUserDialogComponent,
    LinkComponent,
    MediaComponent,
    EditLinksComponent,
    EditMediaComponent,
    ErrorDialogComponent,
    MenubuttonComponent,
  ],
  entryComponents: [
    HomeHelpDialogComponent,
    SendPasswordDialogComponent,
    RecordHelpDialogComponent,
    RecordListHelpDialogComponent,
    DeleteDialogComponent,
    DeleteUserDialogComponent,
    ErrorDialogComponent
  ],

  providers: providers,
  bootstrap: [AppComponent]
})

export class AppModule { }
