# MobilecmsAdmin

This project is a admin app for writing content through a RESTful API.
It is initially intended to manage content from a sport organization, with such content : News, calendar events, public pages, documents, ...
All the data is public, by default. (except users)

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

ng build --prod --base-href /admin/
