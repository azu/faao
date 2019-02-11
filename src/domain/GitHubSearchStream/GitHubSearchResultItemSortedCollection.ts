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

export interface GitHubSearchResultItemSortedCollectionArgs<T extends GitHubSearchResultItem>
    extends GitHubSearchResultItemCollectionArgs<T> {
    sortType: SortTypeArgs;
}

/**
 * Always sorted items
 */
export class GitHubSearchResultItemSortedCollection<
    T extends GitHubSearchResultItem
> extends GitHubSearchResultItemCollection<T> {
    sortType?: SortTypeArgs;

    constructor(protected args: GitHubSearchResultItemSortedCollectionArgs<T>) {
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
        const savedItems = this.rawItems.slice();
        const addingItems = items.slice();
        const actualAdding: T[] = [];
        addingItems.forEach(addingItem => {
            const index = savedItems.findIndex(savedItem => {
                return savedItem.id.equals(addingItem.id);
            });
            if (index === -1) {
                actualAdding.push(addingItem);
                return;
            }
            const item = savedItems[index];
            if (addingItem.updatedAtDate.getTime() > item.updatedAtDate.getTime()) {
                savedItems.splice(index, 1);
                actualAdding.push(addingItem);
            }
        });
        const concatItems = savedItems.concat(actualAdding);
        return new GitHubSearchResultItemSortedCollection(
            Object.assign({}, this.args, {
                items: concatItems
            })
        );
    }
}
