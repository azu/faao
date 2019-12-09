// MIT © 2017 azu
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

export interface GitHubEventSortedCollectionJSON {
    type: "GitHubEventSortedCollection";
    rawItems: GitHubUserActivityEventJSON[];
    filter: SearchFilterJSON;
    sortType: SortTypeArgs;
}

// For events
export class GitHubEventSortedCollection extends SortedCollection<
    GitHubUserActivityEvent,
    "GitHubEventSortedCollection"
> {
    static fromJSON(json: GitHubEventSortedCollectionJSON): GitHubEventSortedCollection {
        return new GitHubEventSortedCollection({
            ...this,
            type: "GitHubEventSortedCollection",
            sortType: json.sortType,
            rawItems: json.rawItems.map(item => GitHubUserActivityEvent.fromJSON(item)),
            filter: json.filter ? SearchFilter.fromJSON(json.filter) : new SearchFilter()
        });
    }

    toJSON(): GitHubEventSortedCollectionJSON {
        return {
            ...this,
            type: "GitHubEventSortedCollection",
            sortType: this.sortType,
            rawItems: this.typedRawItems.map(item => item.toJSON()),
            filter: this.filter ? this.filter.toJSON() : undefined
        };
    }
}
