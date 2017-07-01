// MIT © 2017 azu
import { GitHubSearchResultItem } from "./GitHubSearchResultItem";

export interface GitHubSearchResultJSON {
    items: GitHubSearchResultItem[];
}

// Interface of API result
// http://json2ts.com/
// https://developer.github.com/v3/search/#search-issues
export class GitHubSearchResult implements GitHubSearchResultJSON {
    items: GitHubSearchResultItem[];

    constructor(json: GitHubSearchResultJSON) {
        this.items = json.items;
    }
}
