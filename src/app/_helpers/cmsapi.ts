import { Log } from 'src/app/shared/services';


export class CmsApi {


  private log: Log;

  constructor() {
    this.log = new Log();
  }
  public content() {
  }

  public getLog(): Log {
    return this.log;
  }

  public getItem(name: string, id: string): any {
    const list = this.getItems(name);
    const matched = list.filter(u => { return u.id === id; });
    return matched.length ? matched[0] : null;
  }

  public deleteItem(name: string, id: string): any {
    const list = this.getItems(name);
    const matched = list.filter(u => { return u.id !== id; });
    localStorage.setItem(name, JSON.stringify(matched));
  }

  public addItem(name: string, newItem: any): any {

    const list = this.getItems(name);
    this.log.debug('adding ... ' + list.length + ' ' + newItem.id);

    list.push(newItem);
    this.log.debug('adding done ' + list.length);
    localStorage.setItem(name, JSON.stringify(list));
  }

  public saveItem(name: string, newItem: any): any {
    const list = this.getItems(name);
    let save = false;
    list.forEach(function (part, index, list2) {
      if (part.id === newItem.id) {
        list[index] = newItem;
        save = true;
      }

    });

    if (!save) {
      list.push(newItem);
    }

    localStorage.setItem(name, JSON.stringify(list));
  }


  public getItems(name: string): any[] {

    let result: any[] = null;
    const existingItems = localStorage.getItem(name);
    if (existingItems) {
      result = JSON.parse(existingItems);
    } else  {
      result = [];
      for (let i = 1; i < 10; i++) {
        result.push(this.buildNewItem(name, i.toString()));
      }


      localStorage.setItem(name, JSON.stringify(result));
    }


    return result;
  }

  public getIndex(name: string): any[] {
    return this.getItems(name);
  }



  public buildNewItem(type: string, index: string): any {
    const item = JSON.parse('{\
      "id": "foobar",\
      "date": "2017-11-17",\
      "status": "draft",\
      "format": "bbcode",\
      "title": "foobar",\
      "description": "Lorem ipsum dolor sit amet, \
      consectetur adipiscing elit, \
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, \
      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit \
      in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, \
      sunt in culpa qui officia deserunt mollit anim id est laborum.",\
      "media": [],\
      "images": [],\
      "attachments": []\
  }');

    item.id = item.id + index;
    item.title = type + ' ' + item.title + ' ' + index;
    return item;
  }

  public getTemplate(name: string): any {
    const body = JSON.parse('{\
      "id": "",\
      "title": "foobar",\
      "description": "",\
      "url": ""\
    }');
    return body;
  }

  public getMetadata(name: string): any[] {
    let result = [];
    if ('calendar' === name) {
      result = JSON.parse('[\
      {"name" : "id" , "primary" : "true", "type" : "string",  "editor":"line"},\
      {"name" : "status" , "primary" : "false", "type" : "text",  "editor":"choice", "choices" : ["draft", "published"]},\
      {"name" : "title" , "primary" : "false", "type" : "string",  "editor":"line"},\
      {"name" : "date" , "primary" : "false", "type" : "string",  "editor":"date"},\
      {"name" : "organization" , "primary" : "false", "type" : "string",  "editor":"line"},\
      {"name" : "activity" , "primary" : "false", "type" : "text",  "editor":"choice", "choices" : ["tennis", "basketball", "golf"]},\
      {"name" : "description" , "primary" : "false", "type" : "string",  "editor":"text"},\
      {"name" : "location" , "primary" : "false", "type" : "string",  "editor":"line"},\
      {"name" : "media" , "primary" : "false", "type" : "array",  "editor":"medialist"},\
      {"name" : "images" , "primary" : "false", "type" : "array",  "editor":"imagelist"},\
      {"name" : "attachments" , "primary" : "false", "type" : "array",  "editor":"attachmentlist"}\
    ]');
    } else if ('news' === name) {
      result = JSON.parse('[\
      {"name" : "id" , "primary" : "true", "type" : "string",  "editor":"line"},\
      {"name" : "status" , "primary" : "false", "type" : "text",  "editor":"choice", "choices" : ["draft", "published"]},\
      {"name" : "title" , "primary" : "false", "type" : "string",  "editor":"line"},\
      {"name" : "date" , "primary" : "false", "type" : "string",  "editor":"date"},\
      {"name" : "activity" , "primary" : "false", "type" : "text",  "editor":"choice", "choices" : ["tennis", "basketball", "golf"]},\
      {"name" : "description" , "primary" : "false", "type" : "string",  "editor":"text"},\
      {"name" : "media" , "primary" : "false", "type" : "array",  "editor":"medialist"},\
      {"name" : "images" , "primary" : "false", "type" : "array",  "editor":"imagelist"},\
      {"name" : "attachments" , "primary" : "false", "type" : "array",  "editor":"attachmentlist"}\
    ]');
    } else  {
      result = JSON.parse('[\
      {"name" : "id" , "primary" : "true", "type" : "string",  "editor":"line"},\
      {"name" : "title" , "primary" : "false", "type" : "string",  "editor":"line"},\
      {"name" : "description" , "primary" : "false", "type" : "string",  "editor":"text"},\
      {"name" : "media" , "primary" : "false", "type" : "array",  "editor":"medialist"},\
      {"name" : "images" , "primary" : "false", "type" : "array",  "editor":"imagelist"},\
      {"name" : "attachments" , "primary" : "false", "type" : "array",  "editor":"attachmentlist"}\
    ]')
    }
    return result;
  }

  public getTypes(): any[] {
    return JSON.parse('[{"type":"calendar","labels":[{"i18n":"en","label":"Calendar"},{"i18n":"fr","label":"Calendrier"}]},\
{"type":"news","labels":[{"i18n":"en","label":"News"},{"i18n":"fr","label":"Actualit\u00e9s"}]},\
{"type":"documents","labels":[{"i18n":"en","label":"Documents"},{"i18n":"fr","label":"Documents"}]},\
{"type":"clubs","labels":[{"i18n":"en","label":"Clubs"},{"i18n":"fr","label":"Clubs"}]},\
{"type":"contacts","labels":[{"i18n":"en","label":"Contacts"},{"i18n":"fr","label":"Contacts"}]},\
{"type":"links","labels":[{"i18n":"en","label":"Links"},{"i18n":"fr","label":"Liens"}]},\
{"type":"structure","labels":[{"i18n":"en","label":"Structure"},{"i18n":"fr","label":"Organisation"}]},\
{"type":"reports","labels":[{"i18n":"en","label":"Reports"},{"i18n":"fr","label":"Comptes Rendus"}]}]\
');
  }

}
