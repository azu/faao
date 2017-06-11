// MIT © 2017 azu
import sortBy from "lodash.sortby";
import { GitHubSearchResultItem } from "./GitHubSearchResultItem";
import { GitHubSearchResultItemCollection } from "./GitHubSearchResultItemCollection";
import uniqBy from "lodash.uniqby";

export const SortType = {
    updated: "updated",
    created: "updated"
};
export type SortTypeArgs = "updated" | "created";

export function sort(
    items: GitHubSearchResultItem[],
    sortType: SortTypeArgs
): GitHubSearchResultItem[] {
    if (sortType === SortType.created) {
        return sortBy(items, item => item.createdAtDate).reverse();
    } else if (sortType === SortType.updated) {
        return sortBy(items, item => item.updatedAtDate).reverse();
    }
    return items;
}

/**
 * Always sorted items
 */
export class GitHubSearchResultItemSortedCollection extends GitHubSearchResultItemCollection<
    GitHubSearchResultItem
> {
    sortType: SortTypeArgs;

    constructor(items: GitHubSearchResultItem[], sortType: SortTypeArgs) {
        const sortedItem = sort(items, sortType);
        super(sortedItem);
        this.sortType = sortType;
    }

    mergeItems(items: GitHubSearchResultItem[]): GitHubSearchResultItemSortedCollection {
        return new GitHubSearchResultItemSortedCollection(this.items.concat(items), this.sortType);
    }
}
