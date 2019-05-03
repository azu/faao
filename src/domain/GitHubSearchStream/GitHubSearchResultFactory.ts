// MIT © 2017 azu
import { GitHubSearchResultItem, GitHubSearchResultItemJSON } from "./GitHubSearchResultItem";
import { GitHubSearchResult } from "./GitHubSearchResult";

export interface GitHubSearchResultJSON {
    items: GitHubSearchResultItemJSON[];
}

export class GitHubSearchResultFactory {
    /**
     * Convert response json to GitHubSearchResult.
     * @param result
     * @returns {GitHubSearchResult}
     */
    static create(result: GitHubSearchResultJSON): GitHubSearchResult {
        const items = result.items.map(item => {
            return new GitHubSearchResultItem(item);
        });
        return new GitHubSearchResult({
            items
        });
    }
}
