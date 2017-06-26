// MIT © 2017 azu
import sortBy from "lodash.sortby";
import { GitHubSearchResultItem } from "./GitHubSearchResultItem";
import {
    GitHubSearchResultItemCollection,
    GitHubSearchResultItemCollectionArgs
} from "./GitHubSearchResultItemCollection";

export const SortType = {
    updated: "updated",
    created: "updated"
};
export type SortTypeArgs = "updated" | "created";

export function sort<T extends GitHubSearchResultItem>(items: T[], sortType: SortTypeArgs): T[] {
    if (sortType === SortType.created) {
        return sortBy(items, item => item.createdAtDate).reverse();
    } else if (sortType === SortType.updated) {
        return sortBy(items, item => item.updatedAtDate).reverse();
    }
    return items;
}

export interface GitHubSearchResultItemSortedCollectionArgs<
    T extends GitHubSearchResultItem
> extends GitHubSearchResultItemCollectionArgs<T> {
    sortType: SortTypeArgs;
}

/**
 * Always sorted items
 */
export class GitHubSearchResultItemSortedCollection<
    T extends GitHubSearchResultItem
> extends GitHubSearchResultItemCollection<T> {
    sortType: SortTypeArgs;

    constructor(private args: GitHubSearchResultItemSortedCollectionArgs<T>) {
        super({
            items: args.items,
            filter: args.filter
        });
        if (args.sortType) {
            this.applySort(args.sortType);
        }
    }

    applySort(sortType: SortTypeArgs) {
        this.sortType = sortType;
        this.items = sort(this.items, sortType);
    }

    mergeItems(items: T[]): GitHubSearchResultItemSortedCollection<T> {
        const concatItems = this.rawItems.concat(items);
        return new GitHubSearchResultItemSortedCollection(
            Object.assign({}, this.args, {
                items: concatItems
            })
        );
    }
}
