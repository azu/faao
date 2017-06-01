// MIT © 2017 azu
import { GitHubSearchResult } from "./GitHubSearchResult";
import { GitHubSearchResultItem } from "./GitHubSearchResultItem";

let id = 0;

export class GitHubSearchStream {
    id: string;
    items: GitHubSearchResultItem[];
    private lastResult: GitHubSearchResult | undefined;

    constructor(items: GitHubSearchResultItem[]) {
        this.id = `GitHubSearchStream${id++}`;
        this.items = items;
    }

    mergeResult(result: GitHubSearchResult) {
        this.lastResult = result;
    }

    canContinueToFetch(): boolean {
        if (!this.lastResult) {
            return true;
        }
        return this.lastResult.incomplete_results;
    }
}