
export class Metadata {
//    {"name" : "id" , "primary" : "false", "type" : "string", "length":"255", "editor":"line"},
    name = ''; // name of the field
    primary = ''; //
    type = ''; // string, array
    editor = ''; // line, text, choice
    choices: any[] = null; // used when editor is choice
    length = ''; // field length



}
