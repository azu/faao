// MIT © 2017 azu
import { GitHubSearchStream, GitHubSearchStreamJSON } from "./GitHubSearchStream";
import { GitHubSearchResultItem, Item } from "./GitHubSearchResultItem";

export class GitHubSearchStreamFactory {
    static create() {
        return new GitHubSearchStream([]);
    }

    static createFromStreamJSON(json: GitHubSearchStreamJSON) {
        const items = json.items.map((rawItem) => {
            return new GitHubSearchResultItem(rawItem);
        });
        return new GitHubSearchStream(items);
    }
}