// MIT © 2017 azu
import { GitHubSearchStream, GitHubSearchStreamJSON } from "./GitHubSearchStream";
import { GitHubSearchResultItem } from "./GitHubSearchResultItem";
import { Identifier } from "../Entity";
import ulid from "ulid";

export class GitHubSearchStreamFactory {
    static create() {
        return new GitHubSearchStream({
            id: new Identifier<GitHubSearchStream>(ulid()),
            items: []
        });
    }

    static createFromStreamJSON(json: GitHubSearchStreamJSON) {
        const items = json.items.map(rawItem => {
            return new GitHubSearchResultItem(rawItem);
        });
        return new GitHubSearchStream({
            id: new Identifier<GitHubSearchStream>(ulid()),
            items
        });
    }
}
