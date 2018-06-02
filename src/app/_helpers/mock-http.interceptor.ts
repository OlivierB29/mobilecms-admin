import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Log } from 'app/shared';
import { CmsApi } from './cmsapi';



@Injectable()
export class MockHttpInterceptor implements HttpInterceptor {

  constructor(private log: Log) {
    this.log.debug('new MockHttpInterceptor');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url: string = request.url;
    const method: string = request.method;

    this.log.debug(method + ' -> ' + url);

    return this.commonHttpFakeBackend(url, method, request) || next.handle(request); // fallback in case url isn't caught
  }


  commonHttpFakeBackend(url: string, method: string, request: HttpRequest<any>): Observable<HttpEvent<any>> {
    this.log.debug('commonHttpFakeBackend');

    const cmsApi = new CmsApi();



    // OPTIONS
    if (method === 'OPTIONS') {
      return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: {} })); resp.complete(); });
    }

    // authenticate
    if (url.endsWith('/authenticate') && method === 'POST') {
      // get parameters from post request
      return this.auth(request.body);
    }

    if (url.indexOf('/publicinfo') !== -1 && method === 'GET') {

      const body = JSON.parse('{"name":"Foobar","clientalgorithm":"hashmacbase64","newpasswordrequired":"false"}');
      return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body })); resp.complete(); });
    }

    if (url.indexOf('authapi') !== -1 && request.headers.get('Authorization') !== 'Bearer fake-jwt-token') {
      // return 401 not authorised if token is null or invalid

      return new Observable(resp => { resp.next(new HttpResponse({ status: 401, body: {} })); resp.complete(); });
    }

    // upload doesn't work. Because of  XMLHttpRequest ?
    /*
    if (url.indexOf('basicupload') !== -1 && method === 'POST') {

      connection.mockRespond(new Response(new ResponseOptions({
        status: 200,
        body: JSON.parse('[{"title":"Lorem ipsum","url":"foobar","size":325203,"mimetype":"application\/pdf"}]')

      })));
      return;
    }
  */

    if (url.indexOf('fileapi/v1/basicupload') !== -1 && method === 'GET') {

      const body = JSON.parse('[{"title":"Lorem ipsum","url":"foobar","size":325203,"mimetype":"application\/pdf"},\
    {"title":"activity.jpg","url":"activity.jpg","size":3272,"mimetype":"image\/jpeg"}]');
      return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body })); resp.complete(); });
    }

    if (url.indexOf('fileapi/v1/delete/') !== -1 && method === 'POST') {

      return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: {} })); resp.complete(); });
    }

    if (url.match(/template\/[-a-zA-Z0-9_]*/) && method === 'GET') {

      const body = cmsApi.getTemplate(this.getLast(url));
      return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body })); resp.complete(); });
    }

    if (url.match(/metadata\/[-a-zA-Z0-9_]*/) && method === 'GET') {

      const body = cmsApi.getMetadata(this.getLast(url));
      return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body })); resp.complete(); });
    }

    // get index
    if (url.match(/index\/[-a-zA-Z0-9_]*/) && method === 'GET') {


      const body = cmsApi.getIndex(this.getLast(url));
      return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body })); resp.complete(); });
    }




    // get item by id
    if (url.match(/\/content\/[-a-zA-Z0-9_]*\/[-a-zA-Z0-9_]*/) && method === 'GET') {

      // find item by id in array
      const body = cmsApi.getItem(this.getBeforeLast(url), this.getLast(url));

      return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body })); resp.complete(); });
    }





    if (url.endsWith('/content') && method === 'GET') {

      const body = cmsApi.getTypes();
      return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body })); resp.complete(); });
    }


    //
    // generic responses
    //

    // refresh index
    if (url.indexOf('/index/') !== -1 && method === 'POST') {
      return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: {} })); resp.complete(); });
    }




    // save record
    if (url.match(/content\/[-a-zA-Z0-9_]*/) && method === 'POST') {

      const params = request.body;

      cmsApi.saveItem(this.getLast(url), request.body);

      const ts = Math.ceil(new Date().getTime() / 1000);

      const body = JSON.parse('{}');
      return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body })); resp.complete(); });
    }

    // delete item by id
    if (url.match(/\/content\/[-a-zA-Z0-9_]*\/[-a-zA-Z0-9_]*/) && method === 'DELETE') {

      // find item by id in array
      cmsApi.deleteItem(this.getBeforeLast(url), this.getLast(url));
      // respond 200 OK

      return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: {} })); resp.complete(); });
    }

    return null;
  }


  auth(params: any): Observable<HttpEvent<any>> {


    if (params.user && params.password) {
      const user = JSON.parse('{}');
      user.username = params.user;
      let role = 'editor';
      // enable dynamic of admin role
      if (user.username.indexOf('admin') !== -1) {
        role = 'admin';
      }

      const body = {
        name: user.username,
        email: user.username,
        role: role,
        token: 'fake-jwt-token'
      };
      this.log.debug('mock ' + JSON.stringify(user));
      return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body })); resp.complete(); });
    } else {
      console.error('Username or password is incorrect ');

      return new Observable(resp => {
        resp.next(new HttpResponse({
          status: 401,
          body: { error: 'Username or password is incorrect' }
        })); resp.complete();
      });
    }

  }



  getTokens(url: string): string[] {
    return url.split('/');
  }

  getTokenFromEnd(url: string, i: number): string {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - i];
  }

  getTokenFromBeginning(url: string, i: number): string {
    const urlParts = url.split('/');
    return urlParts[i];
  }

  getBeforeLast(url: string): string {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 2];
  }

  getLast(url: string): string {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  }

}
