// MIT © 2017 azu
import { GitHubSearchResultItem, GitHubSearchResultItemJSON } from "./GitHubSearchResultItem";
import { GitHubSearchResult } from "./GitHubSearchResult";

export interface RawGitHubSearchResultJSON {
    items: (GitHubSearchResultItemJSON & { pull_request?: {} })[];
}

export class GitHubSearchResultFactory {
    /**
     * Convert response json to GitHubSearchResult.
     * @param result
     * @returns {GitHubSearchResult}
     */
    static create(result: RawGitHubSearchResultJSON): GitHubSearchResult {
        const items = result.items.map(item => {
            return new GitHubSearchResultItem({
                ...item,
                type: item.pull_request !== undefined ? "pr" : "issue"
            });
        });
        return new GitHubSearchResult({
            items
        });
    }
}
