// MIT © 2017 azu
// ome from https://github.com/GitbookIO/filterable
export interface SearchFilterJSON {
    type: "in" | "nin" | "=" | "!=" | ">" | ">=" | "<" | "<=";
    field: string;
    value: string;
    originalField: string;
}

export class SearchFilter implements SearchFilterJSON {
    type: "in" | "nin" | "=" | "!=" | ">" | ">=" | "<" | "<=";
    field: string;
    value: string;
    originalField: string;

    constructor(json: SearchFilterJSON) {
        this.type = json.type;
        this.field = json.field;
        this.value = json.value;
        this.originalField = json.originalField;
    }
}
