import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


import { commonHttpFakeBackend } from './fake-backend';



@Injectable()
export class MockHttpInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url: string = request.url;
        const method: string = request.method;

        console.log(method + ' ' + url);

        return commonHttpFakeBackend(url, method, request) ||
            next.handle(request); // fallback in case url isn't caught
    }

}
