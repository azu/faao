// MIT © 2017 azu
import { GitHubSearchResult } from "./GitHubSearchResult";
import { GitHubSearchResultItem } from "./GitHubSearchResultItem";
import { GitHubSearchQuery } from "../GitHubSearchList/GitHubSearchQuery";

let id = 0;

/**
 * Stream has items
 * It is saved with query.
 */
export class GitHubSearchStream {
    id: string;
    items: GitHubSearchResultItem[];
    private lastResult: GitHubSearchResult | undefined;

    constructor(items: GitHubSearchResultItem[]) {
        this.id = `GitHubSearchStream${id++}`;
        this.items = items;
    }

    mergeResult(result: GitHubSearchResult) {
        this.items = this.items.concat(result.items);
        this.lastResult = result;
    }
}