// MIT © 2017 azu
import { GitHubSearchStream, GitHubSearchStreamJSON } from "./GitHubSearchStream";
import { GitHubSearchResultItem } from "./GitHubSearchResultItem";
import { Identifier } from "../Entity";
import { ulid } from "ulid";
import { GitHubSearchResultItemSortedCollection } from "./GitHubSearchResultItemSortedCollection";

export class GitHubSearchStreamFactory {
    static create() {
        return new GitHubSearchStream({
            id: new Identifier<GitHubSearchStream>(ulid()),
            itemSortedCollection: new GitHubSearchResultItemSortedCollection({
                items: [],
                sortType: "updated"
            })
        });
    }

    static createFromStreamJSON(json: GitHubSearchStreamJSON) {
        const items = json.items.map(rawItem => {
            return new GitHubSearchResultItem(rawItem);
        });
        return new GitHubSearchStream({
            id: new Identifier<GitHubSearchStream>(ulid()),
            itemSortedCollection: new GitHubSearchResultItemSortedCollection({
                items: items,
                sortType: "updated"
            })
        });
    }
}
