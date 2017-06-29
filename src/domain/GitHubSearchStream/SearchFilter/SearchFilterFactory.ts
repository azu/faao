// MIT © 2017 azu
import { SearchFilter } from "./SearchFilter";

export class SearchFilterFactory {
    static create(string: string) {
        return new SearchFilter(string);
    }
}
