import { MobilecmsAdminPage } from './app.po';

describe('mobilecms-admin App', () => {
  let page: MobilecmsAdminPage;

  beforeEach(() => {
    page = new MobilecmsAdminPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
