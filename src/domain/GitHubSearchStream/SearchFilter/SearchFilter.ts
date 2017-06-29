// MIT © 2017 azu
import { SearchFilterItem, SearchFilterItemJSON } from "./SearchFilterItem";

const filterable = require("filterable");

export class SearchFilter {
    filterText: string;
    items: SearchFilterItem[];

    constructor(filterText: string) {
        this.filterText = filterText;
        this.items = filterable
            .Query(filterText)
            .parse()
            .toJSON()
            .map((json: SearchFilterItemJSON) => new SearchFilterItem(json));
    }
}
