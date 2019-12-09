// MIT © 2017 azu
import { SortedCollectionItem, SortedCollectionItemJSON } from "./SortedCollection";

export interface GitHubSearchResultJSON {
    items: SortedCollectionItemJSON[];
}

export interface GitHubSearchResultArgs {
    items: SortedCollectionItem[];
}

// Interface of API result
// http://json2ts.com/
// https://developer.github.com/v3/search/#search-issues
export class GitHubSearchResult {
    items: SortedCollectionItem[];

    constructor(json: GitHubSearchResultArgs) {
        this.items = json.items;
    }
}
