
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export class AuthApi {

public auth(connection: MockConnection) {
  let bodyStr = '' + connection.request.getBody();
  bodyStr = decodeURIComponent(bodyStr.replace('requestbody=', ''));

  const params = JSON.parse(bodyStr);

  if (params.user && params.password) {
    const user = JSON.parse('{}');
    user.username = params.user;
    let role = 'editor';
    // enable dynamic of admin role
    if (user.username.indexOf('admin') !== -1) {
      role = 'admin';
    }
    connection.mockRespond(new Response(new ResponseOptions({
      status: 200,
      body: {
        name: user.username,
        email: user.username,
        role: role,
        token: 'fake-jwt-token'
      }

    })));
    console.log('mock ' + JSON.stringify(user));
  } else {
    console.error('Username or password is incorrect ');
    // else return 400 bad request
    connection.mockError(new Error('Username or password is incorrect'));
  }

}

}
