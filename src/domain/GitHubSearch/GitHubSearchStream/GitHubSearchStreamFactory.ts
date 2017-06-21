// MIT © 2017 azu
import { GitHubSearchStream, GitHubSearchStreamJSON } from "./GitHubSearchStream";
import { GitHubSearchResultItem } from "./GitHubSearchResultItem";

export class GitHubSearchStreamFactory {
    static create() {
        return new GitHubSearchStream({
            items: []
        });
    }

    static createFromStreamJSON(json: GitHubSearchStreamJSON) {
        const items = json.items.map(rawItem => {
            return new GitHubSearchResultItem(rawItem);
        });
        return new GitHubSearchStream({
            items
        });
    }
}
