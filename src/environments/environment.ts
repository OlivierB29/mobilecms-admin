// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  locale: 'fr-FR',
  production: false,
  postformdata: false,
  log: 'debug',
  server: 'http://localhost:8888',
  website: 'http://localhost/#',
  defaultlocale: 'en',
  usemockbackend: false,
  api: '/mobilecmsapi/v2/cmsapi',
  adminapi: '/mobilecmsapi/v2/adminapi',
  fileapi: '/mobilecmsapi/v2/fileapi',
  authapi: '/mobilecmsapi/v2/authapi'
};
