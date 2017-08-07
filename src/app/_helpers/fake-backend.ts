import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';


export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {

  // configure fake backend
  backend.connections.subscribe((connection: MockConnection) => {
console.log('fakeBackendFactory ... ' + connection.request.url);
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

    // upload doesn't work. Because of  XMLHttpRequest ?
    /*
    if (connection.request.url.indexOf('basicupload') !== -1 && connection.request.method === RequestMethod.Post) {
      console.log('!!!!!!!!!!! fake /basicupload ' );
      // console.log('!!!!!!!!!!! fake /basicupload 2 ' + connection.request.blob);
      connection.mockRespond(new Response(new ResponseOptions({
        status: 200,
        body: JSON.parse('[{"title":"Lorem ipsum","url":"foobar","size":325203,"mimetype":"application\/pdf"}]')

      })));
      return;
    }
*/

if (connection.request.url.indexOf('fileapi/v1/basicupload') !== -1 && connection.request.method === RequestMethod.Get) {

  // console.log('!!!!!!!!!!! fake /basicupload 2 ' + connection.request.blob);
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

      if (connection.request.url.endsWith('/index/calendar') && connection.request.method === RequestMethod.Get) {

        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('[\
          {"id": "another-basketball-tournament", "date": "2017-11-17","activity": "basketball","title": "another basketball tournament"},\
          {"id": "golf-tournament", "date": "2015-09-01", "activity": "tennis", "title": "golf tournament" },\
          {"id": "some-seminar-of-tennis", "date": "2015-09-01", "activity": "tennis", "title": "some seminar of tennis"}\
          ]')

        })));
        return;
      }



      if (connection.request.url.endsWith('content/calendar/another-basketball-tournament')
       && connection.request.method === RequestMethod.Get) {

        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('{\
    "id": "another-basketball-tournament",\
    "date": "2017-11-17",\
    "activity": "basketball",\
    "title": "another basketball tournament",\
    "organization": "another org",\
    "description": "Lorem ipsum dolor sit amet, \
consectetur adipiscing elit, \
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, \
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit \
in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, \
sunt in culpa qui officia deserunt mollit anim id est laborum.",\
    "url": "",\
    "location": "",\
    "images": [],\
    "attachments": []\
    }')
        })));
        return;
      }

      if (connection.request.url.endsWith('content/calendar/golf-tournament')
       && connection.request.method === RequestMethod.Get) {

        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('{\
    "id": "golf-tournament",\
    "date": "2015-09-01",\
    "activity": "golf",\
    "title": "golf tournament",\
    "organization": "another org",\
    "description": "Lorem ipsum dolor sit amet, \
consectetur adipiscing elit, \
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, \
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit \
in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, \
sunt in culpa qui officia deserunt mollit anim id est laborum.",\
    "url": "",\
    "location": "",\
    "images": [],\
    "attachments": []\
  }')
        })));
        return;
      }

      if (connection.request.url.endsWith('content/calendar/some-seminar-of-tennis')
       && connection.request.method === RequestMethod.Get) {

        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('{\
    "id": "some-seminar-of-tennis",\
    "date": "2015-09-01",\
    "activity": "tennis",\
    "title": "tennis seminar",\
    "organization": "another org",\
    "description": "Lorem ipsum dolor sit amet, \
consectetur adipiscing elit, \
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, \
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit \
in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, \
sunt in culpa qui officia deserunt mollit anim id est laborum.",\
    "url": "",\
    "location": "",\
    "images": [],\
    "attachments": []\
}')
        })));
        return;
      }



      if (connection.request.url.endsWith('calendar/index/metadata.json') && connection.request.method === RequestMethod.Get) {

        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('[\
            {"name" : "id" , "primary" : "true", "type" : "string",  "editor":"line"},\
            {"name" : "title" , "primary" : "false", "type" : "string",  "editor":"line"},\
            {"name" : "date" , "primary" : "false", "type" : "string",  "editor":"date"},\
            {"name" : "organization" , "primary" : "false", "type" : "string",  "editor":"line"},\
            {"name" : "activity" , "primary" : "false", "type" : "text",  "editor":"choice", "choices" : ["tennis", "basketball", "golf"]},\
            {"name" : "description" , "primary" : "false", "type" : "string",  "editor":"text"},\
            {"name" : "location" , "primary" : "false", "type" : "string",  "editor":"line"},\
            {"name" : "media" , "primary" : "false", "type" : "array",  "editor":"medialist"},\
            {"name" : "images" , "primary" : "false", "type" : "array",  "editor":"imagelist"},\
            {"name" : "attachments" , "primary" : "false", "type" : "array",  "editor":"attachmentlist"}\
          ]')
        })));
        return;
      }

      if (connection.request.url.endsWith('news/index/metadata.json') && connection.request.method === RequestMethod.Get) {

        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('[\
            {"name" : "id" , "primary" : "true", "type" : "string",  "editor":"line"},\
            {"name" : "title" , "primary" : "false", "type" : "string",  "editor":"line"},\
            {"name" : "date" , "primary" : "false", "type" : "string",  "editor":"date"},\
            {"name" : "activity" , "primary" : "false", "type" : "text",  "editor":"choice", "choices" : ["tennis", "basketball", "golf"]},\
            {"name" : "description" , "primary" : "false", "type" : "string",  "editor":"text"},\
            {"name" : "media" , "primary" : "false", "type" : "array",  "editor":"medialist"},\
            {"name" : "images" , "primary" : "false", "type" : "array",  "editor":"imagelist"},\
            {"name" : "attachments" , "primary" : "false", "type" : "array",  "editor":"attachmentlist"}\
          ]')
        })));
        return;
      }

      if (connection.request.url.endsWith('/index/metadata.json') && connection.request.method === RequestMethod.Get) {

        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('[\
            {"name" : "id" , "primary" : "true", "type" : "string",  "editor":"line"},\
            {"name" : "title" , "primary" : "false", "type" : "string",  "editor":"line"},\
            {"name" : "description" , "primary" : "false", "type" : "string",  "editor":"text"},\
            {"name" : "media" , "primary" : "false", "type" : "array",  "editor":"medialist"},\
            {"name" : "images" , "primary" : "false", "type" : "array",  "editor":"imagelist"},\
            {"name" : "attachments" , "primary" : "false", "type" : "array",  "editor":"attachmentlist"}\
          ]')
        })));
        return;
      }


      if (connection.request.url.endsWith('/content') && connection.request.method === RequestMethod.Get) {

        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('[{"type":"calendar","labels":[{"i18n":"en","label":"Calendar"},{"i18n":"fr","label":"Calendrier"}]},\
      {"type":"news","labels":[{"i18n":"en","label":"News"},{"i18n":"fr","label":"Actualit\u00e9s"}]},\
      {"type":"documents","labels":[{"i18n":"en","label":"Documents"},{"i18n":"fr","label":"Documents"}]},\
      {"type":"clubs","labels":[{"i18n":"en","label":"Clubs"},{"i18n":"fr","label":"Clubs"}]},\
      {"type":"contacts","labels":[{"i18n":"en","label":"Contacts"},{"i18n":"fr","label":"Contacts"}]},\
      {"type":"links","labels":[{"i18n":"en","label":"Links"},{"i18n":"fr","label":"Liens"}]},\
      {"type":"structure","labels":[{"i18n":"en","label":"Structure"},{"i18n":"fr","label":"Organisation"}]},\
      {"type":"reports","labels":[{"i18n":"en","label":"Reports"},{"i18n":"fr","label":"Comptes Rendus"}]}]\
      ')

        })));
        return;
      }
      // authenticate
      if (connection.request.url.endsWith('/authenticate') && connection.request.method === RequestMethod.Post) {
        // get parameters from post request

        let bodyStr = '' + connection.request.getBody();
        bodyStr = bodyStr.replace('requestbody=', '');

        const params = JSON.parse(bodyStr);

        if (params.user && params.password) {
          const user = JSON.parse('{}');
          user.username = params.user;

          connection.mockRespond(new Response(new ResponseOptions({
            status: 200,
            body: {
              name: user.username,
              email: user.username,
              role: 'admin',
              token: 'fake-jwt-token'
            }

          })));
          console.log('mock ' + JSON.stringify(user));
        } else {
          console.error('Username or password is incorrect ');
          // else return 400 bad request
          connection.mockError(new Error('Username or password is incorrect'));
        }

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

      // get index
      if (connection.request.url.indexOf('/index/') !== -1 && connection.request.method === RequestMethod.Get) {
        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('[\
          {"id": "foobar1", "date": "2017-11-17","activity": "basketball","title": "Lorem ipsum 1"},\
          {"id": "foobar2", "date": "2015-09-01", "activity": "tennis", "title": "Lorem ipsum 2" },\
          {"id": "foobar3", "date": "2015-09-01", "activity": "tennis", "title": "Lorem ipsum 3"}]')

        })));
        return;
      }

      // save record
      if (connection.request.url.indexOf('/content/') !== -1 && connection.request.method === RequestMethod.Post) {
        const ts = Math.ceil(new Date().getTime() / 1000);
        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('{"timestamp":"' + ts + '"}')

        })));
        return;
      }
      // get record
      if (connection.request.url.indexOf('content/news/')
       && connection.request.method === RequestMethod.Get) {

        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('{\
    "id": "foobar",\
    "date": "2017-11-17",\
    "activity": "basketball",\
    "title": "Lorem ipsum",\
    "description": "Lorem ipsum dolor sit amet, \
    consectetur adipiscing elit, \
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, \
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit \
    in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, \
    sunt in culpa qui officia deserunt mollit anim id est laborum.",\
    "media": [],\
    "images": [],\
    "attachments": []\
    }')
        })));
        return;
      }

      if (connection.request.url.indexOf('content/')
       && connection.request.method === RequestMethod.Get) {

        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('{\
            "id": "foobar",\
            "date": "2017-11-17",\
            "title": "Lorem ipsum",\
            "description": "Lorem ipsum dolor sit amet, \
            consectetur adipiscing elit, \
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, \
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit \
            in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, \
            sunt in culpa qui officia deserunt mollit anim id est laborum.",\
            "media": [],\
            "images": [],\
            "attachments": []\
    }')
        })));
        return;
      }

      console.log('fakeBackendFactory default call ' + connection.request.url);
      // pass through any requests not handled above
        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: JSON.parse('{}')
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
