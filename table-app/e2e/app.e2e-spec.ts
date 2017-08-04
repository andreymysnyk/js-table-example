import { TableAppPage } from './app.po';

describe('table-app App', () => {
  let page: TableAppPage;

  beforeEach(() => {
    page = new TableAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
