## Development server
- NodeJS
- [Angular CLI](https://cli.angular.io/)

## Quick setup example
nvm install 18.10.0
npm install -g @angular/cli@16.2.16
npm i
npm start


## Development server
###  With a running API
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

###  Demo with a fake API
- Open app.module.ts and uncomment annoted code near "uncomment to enable demo".
- Run `npm run demo`
- issues : File upload doesn't work

## Build
- Prod build with specified web context : `npm run dist`
- Demo build for github pages : `npm run demobuild`

