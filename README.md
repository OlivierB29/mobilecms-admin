# MobilecmsAdmin

This project is a admin app for writing content through a RESTful API.
It is initially intended to manage content from a sport organization, with such content : News, calendar events, public pages, documents, ...
All the data is public, by default. (except users)

Visit the [admin demo](https://olivierb29.github.io/mobilecms-demo/admin) on github pages.
Use any user-password combination on this version. All API calls use a mocked API.

# Web site frontend
- visit the [demo](https://olivierb29.github.io/mobilecms-demo).
- source code : [mobilecms](https://github.com/OlivierB29/mobilecms)

## Dependencies

- Angular.io + Angular Material
- [@ngx-translate](http://www.ngx-translate.com/)
- Hosted on a cheap server, with no database available
- A running [mobilecms-api](https://github.com/OlivierB29/mobilecms-api)

## Dev dependencies

- NodeJS
- Angular CLI

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

Build with specified web context : `ng build --prod --base-href /admin/`
Demo build for github pages : `ng build --prod --env=demo --base-href /mobilecms-demo/admin/`

## register a new user
- open `http://localhost:4200/register`
- edit /var/www/private/users/email@example.com.json and change the role for editor or admin
- login `http://localhost:4200/`
