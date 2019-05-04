// MIT © 2017 azu
// ome from https://github.com/GitbookIO/filterable
export interface SearchFilterItemJSON {
    type: "in" | "nin" | "=" | "!=" | ">" | ">=" | "<" | "<=";
    field: string;
    value: string;
    originalField: string;
}

export class SearchFilterItem implements SearchFilterItemJSON {
    type: "in" | "nin" | "=" | "!=" | ">" | ">=" | "<" | "<=";
    field: string;
    value: string;
    originalField: string;

    constructor(json: SearchFilterItemJSON) {
        this.type = json.type;
        this.field = json.field;
        this.value = json.value;
        this.originalField = json.originalField;
    }

    static fromJSON(json: SearchFilterItemJSON): SearchFilterItem {
        const setting = Object.create(SearchFilterItem.prototype);
        return Object.assign(setting, json);
    }

    toJSON(): SearchFilterItemJSON {
        return Object.assign({}, this);
    }
}
