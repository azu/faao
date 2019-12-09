// MIT © 2017 azu
import { GitHubSearchResultItem, GitHubSearchResultItemJSON } from "./GitHubSearchResultItem";
import { SearchFilter, SearchFilterJSON } from "./SearchFilter/SearchFilter";
import { SortedCollection } from "./SortedCollection";

export const SortType = {
    updated: "updated",
    created: "updated"
};
export type SortTypeArgs = "updated" | "created";

export interface GitHubSearchResultItemSortedCollectionJSON {
    type: "GitHubSearchResultItemSortedCollection";
    rawItems: GitHubSearchResultItemJSON[];
    filter: SearchFilterJSON;
    sortType: SortTypeArgs;
}

/**
 * GitHub Search Result Item Collection has ResultItems
 */
export class GitHubSearchResultItemSortedCollection extends SortedCollection<
    GitHubSearchResultItem,
    "GitHubSearchResultItemSortedCollection"
> {
    static fromJSON(
        json: GitHubSearchResultItemSortedCollectionJSON
    ): GitHubSearchResultItemSortedCollection {
        return new GitHubSearchResultItemSortedCollection({
            ...this,
            type: "GitHubSearchResultItemSortedCollection",
            sortType: json.sortType,
            rawItems: json.rawItems.map(item => GitHubSearchResultItem.fromJSON(item)),
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
