// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  log: 'debug',
  server: 'http://localhost:80',
  website: 'http://localhost/#',
  defaultlocale: 'en',
  usemockbackend: false,
  api: '/mobilecmsapi/v1/cmsapi',
  adminapi: '/mobilecmsapi/v1/adminapi',
  fileapi: '/mobilecmsapi/v1/fileapi',
  authapi: '/mobilecmsapi/v1/authapi'
};
