import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { AuthApi } from './authapi';
import { CmsApi } from './cmsapi';


function getMethod(connection: MockConnection) {
  let result = '';
  if (connection.request.method === RequestMethod.Get) {
    result = 'GET';
  } else if (connection.request.method === RequestMethod.Post) {
    result = 'POST';
  } else if (connection.request.method === RequestMethod.Put) {
    result = 'PUT';
  } else if (connection.request.method === RequestMethod.Delete) {
    result = 'DELETE';
  }else if (connection.request.method === RequestMethod.Options) {
    result = 'OPTIONS';
  }
  return result;
}

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

export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {

  const authApi = new AuthApi();
  const cmsApi = new CmsApi();


  // configure fake backend
  backend.connections.subscribe((connection: MockConnection) => {
    console.log('fakeBackendFactory ... ' + getMethod(connection) + ' ' + connection.request.url);

    // wrap in timeout to simulate server api call
    setTimeout(() => {
      // OPTIONS
      if (connection.request.method === RequestMethod.Options) {
        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: {}
        })));
        return;

      }

      // authenticate
      if (connection.request.url.endsWith('/authenticate') && connection.request.method === RequestMethod.Post) {
        // get parameters from post request
            authApi.auth(connection);
        return;
      }

      if (connection.request.url.indexOf('authapi') !== -1 && connection.request.headers.get('Authorization') !== 'Bearer fake-jwt-token') {
          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          return;
      }

    // upload doesn't work. Because of  XMLHttpRequest ?
    /*
    if (connection.request.url.indexOf('basicupload') !== -1 && connection.request.method === RequestMethod.Post) {

      connection.mockRespond(new Response(new ResponseOptions({
        status: 200,
        body: JSON.parse('[{"title":"Lorem ipsum","url":"foobar","size":325203,"mimetype":"application\/pdf"}]')

      })));
      return;
    }
*/

if (connection.request.url.indexOf('fileapi/v1/basicupload') !== -1 && connection.request.method === RequestMethod.Get) {


  connection.mockRespond(new Response(new ResponseOptions({
    status: 200,
    body: JSON.parse('[{"title":"Lorem ipsum","url":"foobar","size":325203,"mimetype":"application\/pdf"},\
    {"title":"activity.jpg","url":"activity.jpg","size":3272,"mimetype":"image\/jpeg"}]')

  })));
  return;
}

      if (connection.request.url.indexOf('fileapi/v1/delete/') !== -1 && connection.request.method === RequestMethod.Post) {

        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('TODO')

        })));
        return;
      }

      if (connection.request.url.endsWith('file/?file=calendar/index/new.json') && connection.request.method === RequestMethod.Get) {

        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('{\
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
}')
        })));
        return;
      }

      if (connection.request.url.endsWith('index/new.json') && connection.request.method === RequestMethod.Get) {

        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('{\
    "id": "",\
    "title": "sample",\
    "description": "",\
    "url": ""\
}')
        })));
        return;
      }




if (connection.request.url.match(/\?.+\/index\/metadata\.json/) && connection.request.method === RequestMethod.Get) {


              const fileAndType = getTokenFromEnd(connection.request.url, 3);
              const fileAndTypeArray = fileAndType.split('=');

              connection.mockRespond(new Response(new ResponseOptions({
                status: 200,
                body: cmsApi.getMetadata(fileAndTypeArray[1])
              })));
              return;
}

// get index
if (connection.request.url.match(/index\/[-a-zA-Z0-9_]*/) && connection.request.method === RequestMethod.Get) {

  connection.mockRespond(new Response(new ResponseOptions({
    status: 200,
    body: cmsApi.getIndex(getLast(connection.request.url))
  })));
  return;
}


// get item by id
if (connection.request.url.match(/\/content\/[-a-zA-Z0-9_]*\/[-a-zA-Z0-9_]*/) && connection.request.method === RequestMethod.Get) {

        // find item by id in array
        const item: any = cmsApi.getItem( getBeforeLast(connection.request.url), getLast(connection.request.url));
        // respond 200 OK
        connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: item })));

    return;
}





      if (connection.request.url.endsWith('/content') && connection.request.method === RequestMethod.Get) {

        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: cmsApi.getTypes()
        })));
        return;
      }


      //
      // generic responses
      //

      // refresh index
      if (connection.request.url.indexOf('/index/') !== -1 && connection.request.method === RequestMethod.Post) {
        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('{}')

        })));
        return;
      }





      // save record
      if (connection.request.url.match(/content\/[-a-zA-Z0-9_]*/) && connection.request.method === RequestMethod.Post) {

        const bodyStr = decodeURIComponent(connection.request.getBody().replace('requestbody=', ''));
        const params = JSON.parse(bodyStr);

        cmsApi.saveItem(getLast(connection.request.url), params);

        const ts = Math.ceil(new Date().getTime() / 1000);
        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('{"timestamp":"' + ts + '"}')

        })));
        return;
      }


// delete item by id
if (connection.request.url.match(/\/content\/[-a-zA-Z0-9_]*\/[-a-zA-Z0-9_]*/) && connection.request.method === RequestMethod.Delete) {

        // find item by id in array
        cmsApi.deleteItem( getBeforeLast(connection.request.url), getLast(connection.request.url));
        // respond 200 OK
        connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: {} })));

    return;
}

      console.log('fakeBackendFactory default call ' + connection.request.url);
      // pass through any requests not handled above
        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: {}
        })));
        return;

    }, 100);

  });

  return new Http(backend, options);
};

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: Http,
  useFactory: fakeBackendFactory,
  deps: [MockBackend, BaseRequestOptions, XHRBackend]
};
