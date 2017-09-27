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
import { AdminService, ContentService, UploadService} from 'app/_services/index';
import { HomeComponent, HomeHelpDialogComponent } from './home';

import { RegisterComponent } from 'app/register/index';
import { RecordListComponent, RecordListHelpDialogComponent } from 'app/recordlist/index';
import { UserListComponent, DeleteUserDialogComponent, UserRecordComponent } from 'app/users';
import { RecordComponent, EditLinksComponent, EditMediaComponent,
   ErrorDialogComponent, DeleteDialogComponent, RecordHelpDialogComponent } from 'app/record';

import { ModifyPasswordComponent , SendPasswordDialogComponent } from 'app/login';

import { MainPageComponent, MenubuttonComponent } from 'app/mainpage';

import { OrderbyPipe } from 'app/shared/filters';



// @angular/common/http
import { MockHttpInterceptor } from 'app/_helpers/mock-http.interceptor';

import { environment } from 'environments/environment';
import { AdminCmsSharedModule } from 'app/shared/shared.module';



const providers: any[] = [
  AdminService,
  ContentService,
  UploadService,
  HttpClient,
];

// use mock backend if env variable is set
if (environment.usemockbackend === true) {
    providers.push({
        provide: HTTP_INTERCEPTORS,
        useClass: MockHttpInterceptor,
        multi: true
    });
}

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

    MainPageComponent,
    SendPasswordDialogComponent,
    MenubuttonComponent,
    AppComponent,
    AlertComponent,
    HomeComponent,
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

    EditLinksComponent,
    EditMediaComponent,
    ErrorDialogComponent
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
