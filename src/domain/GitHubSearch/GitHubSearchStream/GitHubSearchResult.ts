// MIT © 2017 azu
import { GitHubSearchResultItem, Item } from "./GitHubSearchResultItem";

export interface GitHubSearchResultJSON {
    items: GitHubSearchResultItem[]
    // total_count: number;
    // incomplete_results: boolean;
}

// Interface of API result
// http://json2ts.com/
// https://developer.github.com/v3/search/#search-issues
export class GitHubSearchResult implements GitHubSearchResultJSON {
    items: GitHubSearchResultItem[];
    // total_count: number;
    // incomplete_results: boolean;

    constructor(json: GitHubSearchResultJSON) {
        this.items = json.items;
        // this.total_count = json.total_count;
        // this.incomplete_results = json.incomplete_results;
    }
}