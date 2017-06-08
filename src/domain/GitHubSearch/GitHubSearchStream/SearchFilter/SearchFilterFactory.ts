// MIT © 2017 azu
import { SearchFilter, SearchFilterJSON } from "./SearchFilter";

const filterable = require("filterable");

export class SearchFilterFactory {
    static create(string: string) {
        const query = filterable.Query(string).parse();
        return query.toJSON().map((json: SearchFilterJSON) => new SearchFilter(json));
    }
}
