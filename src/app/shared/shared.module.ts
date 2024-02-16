import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LoginService } from './login/login.service';

import { OrderbyPipe } from './filters/orderby.pipe';
import { AdminCmsSharedLibsModule } from './shared-libs.module';
import { UserRouteAccessService } from './auth/user-route-access-service';
import { CommonClientService, JwtClientService, AlertService,
   LocaleService, StringUtils, WindowService, Log, SecurityService  } from './services';
   import {   LocaleDatePipe } from './pipes';
@NgModule({
    imports: [
      AdminCmsSharedLibsModule,
    ],
    declarations: [
      OrderbyPipe,
      LocaleDatePipe,
    ],
    providers: [
        OrderbyPipe,
        UserRouteAccessService,
        JwtClientService,
        CommonClientService,
        AlertService,
        LocaleService,
        StringUtils,
        WindowService,
        LoginService,
        SecurityService,
        Log
    ],

    exports: [
      OrderbyPipe,
      LocaleDatePipe,
      AdminCmsSharedLibsModule,
    ],

})
export class AdminCmsSharedModule {}
