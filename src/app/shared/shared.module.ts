import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LoginService } from './login/login.service';

import { OrderbyPipe } from './filters/orderby.pipe';
import { AdminCmsSharedLibsModule } from './shared-libs.module';
import { UserRouteAccessService } from './auth/user-route-access-service';
import { CommonClientService, JwtClientService, AlertService,
   LocaleService, StringUtils, WindowService, Log  } from './services';

@NgModule({
    imports: [
      AdminCmsSharedLibsModule,
    ],
    declarations: [
      OrderbyPipe,
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
        Log
    ],
    entryComponents: [
    ],
    exports: [
      OrderbyPipe,
      AdminCmsSharedLibsModule,
    ],

})
export class AdminCmsSharedModule {}
