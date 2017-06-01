// MIT © 2017 azu
import { GitHubSearchResultItem, Item } from "./GitHubSearchResultItem";
import { GitHubSearchResult } from "./GitHubSearchResult";

export interface GitHubSearchResultJSON {
    items: Item[]
    total_count: number;
    incomplete_results: boolean;
}

export class GitHubSearchResultFactory {
    items: Item[];
    total_count: number;
    incomplete_results: boolean;

    /**
     * Convert response json to GitHubSearchResult.
     * @param result
     * @returns {GitHubSearchResult}
     */
    static create(result: GitHubSearchResultJSON): GitHubSearchResult {
        const items = result.items.map(item => new GitHubSearchResultItem(item));
        return new GitHubSearchResult({
            items,
            total_count: result.total_count,
            incomplete_results: result.incomplete_results,
        })
    }
}