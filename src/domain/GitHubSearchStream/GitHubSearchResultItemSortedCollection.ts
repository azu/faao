// MIT © 2017 azu
import {
    GitHubSearchResultItem,
    GitHubSearchResultItemJSON,
    isGitHubSearchResultItemJSON
} from "./GitHubSearchResultItem";
import { SearchFilter, SearchFilterJSON } from "./SearchFilter/SearchFilter";
import { SortedCollection } from "./SortedCollection";
import {
    GitHubUserActivityEvent,
    GitHubUserActivityEventJSON
} from "../GitHubUser/GitHubUserActivityEvent";

export const SortType = {
    updated: "updated",
    created: "updated"
};
export type SortTypeArgs = "updated" | "created";

export interface GitHubSearchResultItemSortedCollectionJSON {
    type: "GitHubSearchResultItemSortedCollection";
    rawItems: (GitHubSearchResultItemJSON | GitHubUserActivityEventJSON)[];
    filter: SearchFilterJSON;
    sortType: SortTypeArgs;
}

/**
 * GitHub Search Result Item Collection has ResultItems
 */
export class GitHubSearchResultItemSortedCollection extends SortedCollection<
    GitHubSearchResultItem | GitHubUserActivityEvent,
    "GitHubSearchResultItemSortedCollection"
> {
    static fromJSON(
        json: GitHubSearchResultItemSortedCollectionJSON
    ): GitHubSearchResultItemSortedCollection {
        return new GitHubSearchResultItemSortedCollection({
            ...this,
            type: "GitHubSearchResultItemSortedCollection",
            sortType: json.sortType,
            rawItems: json.rawItems.map(item => {
                if (isGitHubSearchResultItemJSON(item)) {
                    return GitHubSearchResultItem.fromJSON(item);
                } else {
                    return GitHubUserActivityEvent.fromJSON(item);
                }
            }),
            filter: json.filter ? SearchFilter.fromJSON(json.filter) : new SearchFilter()
        });
    }

    toJSON(): GitHubSearchResultItemSortedCollectionJSON {
        return {
            ...this,
            type: "GitHubSearchResultItemSortedCollection",
            sortType: this.sortType,
            rawItems: this.typedRawItems.map(item => item.toJSON()),
            filter: this.filter ? this.filter.toJSON() : undefined
        };
    }
}
