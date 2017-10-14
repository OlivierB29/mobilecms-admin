/**
* init with a routerLink for a local UI button, or with a URL for an external link
*/

export class MenuItem {
  /**
  * eg www.foobar.org
  */
  url: string;
  /**
  * /records/calendar/
  */
  routerLink: string | string[]; // /someMenu
  /**
  * TODO
  */
  routerLinkActive: string; // active

  /**
  * label
  */
  title: string; // Menu Title

  icon: string; // Menu Title

  state = 'inactive';


}
