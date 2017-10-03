import { HttpRequest, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


import { CmsApi } from './cmsapi';



function getTokens(url: string): string[] {
  return url.split('/');
}

function getTokenFromEnd(url: string, i: number): string {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - i];
}

function getTokenFromBeginning(url: string, i: number): string {
  const urlParts = url.split('/');
  return urlParts[i];
}

function getBeforeLast(url: string): string {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 2];
}

function getLast(url: string): string {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1 ];
}


export function commonHttpFakeBackend(url: string, method: string, request: HttpRequest<any>): Observable<HttpEvent<any>> {


  const cmsApi = new CmsApi();
  console.log('init commonHttpFakeBackend');


      // OPTIONS
      if (method === 'OPTIONS') {
        return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: {}  })); resp.complete(); });
      }

      // authenticate
      if (url.endsWith('/authenticate') && method === 'POST') {
        // get parameters from post request
        return auth(request.body);
      }

      if (url.indexOf('/publicinfo') !== -1 && method === 'GET') {

        const body = JSON.parse('{"name":"Foobar","clientalgorithm":"hashmacbase64","newpasswordrequired":"false"}');
        return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body  })); resp.complete(); });
      }

      if (url.indexOf('authapi') !== -1 && request.headers.get('Authorization') !== 'Bearer fake-jwt-token') {
          // return 401 not authorised if token is null or invalid

          return new Observable(resp => { resp.next(new HttpResponse({ status: 401, body: {}  })); resp.complete(); });
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
  return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body  })); resp.complete(); });
  }

      if (url.indexOf('fileapi/v1/delete/') !== -1 && method === 'POST') {

        return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: {}  })); resp.complete(); });
      }

      if (url.endsWith('file/?file=calendar/index/new.json') && method === 'GET') {
        const body = JSON.parse('{\
  "id": "",\
  "date": "",\
  "activity": "tennis",\
  "title": "sample",\
  "organization": "",\
  "description": "",\
  "location": "...",\
  "url": "",\
  "images": [],\
  "attachments": []\
}');

        return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body  })); resp.complete(); });
      }

      if (url.endsWith('index/new.json') && method === 'GET') {
        const body = JSON.parse('{\
            "id": "",\
            "title": "sample",\
            "description": "",\
            "url": ""\
          }');

        return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body  })); resp.complete(); });
      }




  if (url.match(/\?.+\/index\/metadata\.json/) && method === 'GET') {


              const fileAndType = getTokenFromEnd(url, 3);
              const fileAndTypeArray = fileAndType.split('=');

              const body = cmsApi.getMetadata(fileAndTypeArray[1]);
              return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body  })); resp.complete(); });
  }

  // get index
  if (url.match(/index\/[-a-zA-Z0-9_]*/) && method === 'GET') {


  const body = cmsApi.getIndex(getLast(url));
  return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body  })); resp.complete(); });
  }


  // get item by id
  if (url.match(/\/content\/[-a-zA-Z0-9_]*\/[-a-zA-Z0-9_]*/) && method === 'GET') {

        // find item by id in array
        const body = cmsApi.getItem( getBeforeLast(url), getLast(url));

    return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body  })); resp.complete(); });
  }





      if (url.endsWith('/content') && method === 'GET') {

        const body = cmsApi.getTypes();
        return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body  })); resp.complete(); });
      }


      //
      // generic responses
      //

      // refresh index
      if (url.indexOf('/index/') !== -1 && method === 'POST') {
        return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: {}  })); resp.complete(); });
      }




      // save record
      if (url.match(/content\/[-a-zA-Z0-9_]*/) && method === 'POST') {

        const params = request.body;

        cmsApi.saveItem(getLast(url), request.body);

        const ts = Math.ceil(new Date().getTime() / 1000);

        const body = JSON.parse('{"timestamp":"' + ts + '"}');
        return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body  })); resp.complete(); });
      }

      // delete item by id
      if (url.match(/\/content\/[-a-zA-Z0-9_]*\/[-a-zA-Z0-9_]*/) && method === 'DELETE') {

              // find item by id in array
              cmsApi.deleteItem( getBeforeLast(url), getLast(url));
              // respond 200 OK

          return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: {}  })); resp.complete(); });
      }

  return null;
}


 function auth(params: any): Observable<HttpEvent<any>>  {

  //  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!! auth 0 ' + bodyStr);
  // const decoded = decodeURIComponent(bodyStr);
  // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!! auth 1');
  // const params = JSON.parse(decoded);
  // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!! auth 2');
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
    console.log('mock ' + JSON.stringify(user));
    return new Observable(resp => { resp.next(new HttpResponse({ status: 200, body: body  })); resp.complete(); });
  } else {
    console.error('Username or password is incorrect ');

    return new Observable(resp => { resp.next(new HttpResponse({ status: 401,
       body: {error: 'Username or password is incorrect'}  })); resp.complete(); });
  }

}
