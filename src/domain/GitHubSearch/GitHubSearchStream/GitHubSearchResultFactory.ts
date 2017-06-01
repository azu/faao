// MIT © 2017 azu
import { GitHubSearchResultItem, Item } from "./GitHubSearchResultItem";
import { GitHubSearchResult } from "./GitHubSearchResult";

export interface GitHubSearchResultJSON {
    items: Item[]
}

export class GitHubSearchResultFactory {
    items: Item[];

    /**
     * Convert response json to GitHubSearchResult.
     * @param result
     * @returns {GitHubSearchResult}
     */
    static create(result: GitHubSearchResultJSON): GitHubSearchResult {
        const items = result.items.map(item => new GitHubSearchResultItem(item));
        return new GitHubSearchResult({
            items
        })
    }
}