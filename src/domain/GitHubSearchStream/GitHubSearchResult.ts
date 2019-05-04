// MIT © 2017 azu
import { GitHubSearchResultItem, GitHubSearchResultItemJSON } from "./GitHubSearchResultItem";

export interface GitHubSearchResultJSON {
    items: GitHubSearchResultItemJSON[];
}

export interface GitHubSearchResultArgs {
    items: GitHubSearchResultItem[];
}

// Interface of API result
// http://json2ts.com/
// https://developer.github.com/v3/search/#search-issues
export class GitHubSearchResult {
    items: GitHubSearchResultItem[];

    constructor(json: GitHubSearchResultArgs) {
        this.items = json.items;
    }
}
