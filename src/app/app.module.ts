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
import { MyMaterialModule } from 'src/app/mymaterial.module';

// project imports
import { routing } from './app.routing';
import { AppComponent } from 'src/app/app.component';

import { AlertComponent } from 'src/app/_directives/index';
// import { AuthGuard } from 'src/app/_guards/index';
import { AdminService, ContentService, UploadService} from 'src/app/shared/services';
import { HomeComponent, HomeHelpDialogComponent } from './home';

import { RegisterComponent } from 'src/app/register/index';
import { RecordListComponent, RecordListHelpDialogComponent } from 'src/app/recordlist/index';
import { UserListComponent, DeleteUserDialogComponent, UserRecordComponent } from 'src/app/users';
import { RecordComponent,
LinkComponent,
  MediaComponent,
  EditLinksComponent,
  EditMediaComponent,
  ErrorDialogComponent, DeleteDialogComponent, RecordHelpDialogComponent } from 'src/app/record';

import { LoginComponent, ModifyPasswordComponent , SendPasswordDialogComponent } from 'src/app/login';

import { MenubuttonComponent } from 'src/app/mainpage';

import { OrderbyPipe } from 'src/app/shared/filters';



// @angular/common/http
import { MockHttpInterceptor } from 'src/app/_helpers/mock-http.interceptor';

import { environment } from 'src/environments/environment';
import { AdminCmsSharedModule } from 'src/app/shared/shared.module';

import { AdminMainpageComponent } from 'src/app/admin-mainpage/admin-mainpage.component';


import { LoginLayoutComponent } from 'src/app/layouts/login-layout.component';
import { BBCodeURLDialogComponent } from './record/bbcodeurldialog.component';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
  imports: [
    CKEditorModule,

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
    BBCodeURLDialogComponent,
    DeleteUserDialogComponent,
    LinkComponent,
    MediaComponent,
    EditLinksComponent,
    EditMediaComponent,
    ErrorDialogComponent,
    MenubuttonComponent,

    HomeHelpDialogComponent,
    SendPasswordDialogComponent,
    RecordHelpDialogComponent,
    RecordListHelpDialogComponent,
    DeleteDialogComponent,
    BBCodeURLDialogComponent,
    DeleteUserDialogComponent,
    ErrorDialogComponent
  ],

  providers: [
    AdminService,
    ContentService,
    UploadService,
    HttpClient,
    // uncomment to enable demo : mock of HTTP requests
   // { provide: HTTP_INTERCEPTORS, useClass: MockHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
