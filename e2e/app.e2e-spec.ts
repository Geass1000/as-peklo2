import { ArchBasePage } from './app.po';

describe('arch-base App', () => {
  let page: ArchBasePage;

  beforeEach(() => {
    page = new ArchBasePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
