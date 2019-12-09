// MIT © 2017 azu
import { GitHubSearchStream } from "./GitHubSearchStream";
import { Identifier } from "../Entity";
import { ulid } from "ulid";
import { GitHubSearchResultItemSortedCollection } from "./GitHubSearchResultItemSortedCollection";
import { RawGitHubSearchResultJSON } from "./GitHubSearchResultFactory";
import { SearchFilter } from "./SearchFilter/SearchFilter";

export class GitHubSearchStreamFactory {
    static create() {
        return new GitHubSearchStream({
            id: new Identifier<GitHubSearchStream>(ulid()),
            itemSortedCollection: new GitHubSearchResultItemSortedCollection({
                type: "GitHubSearchResultItemSortedCollection",
                rawItems: [],
                filter: new SearchFilter(),
                sortType: "updated"
            })
        });
    }

    static createFromSearchResultJSON(json: RawGitHubSearchResultJSON) {
        return new GitHubSearchStream({
            id: new Identifier<GitHubSearchStream>(ulid()),
            itemSortedCollection: GitHubSearchResultItemSortedCollection.fromJSON({
                type: "GitHubSearchResultItemSortedCollection",
                rawItems: json.items,
                filter: new SearchFilter(),
                sortType: "updated"
            })
        });
    }
}
