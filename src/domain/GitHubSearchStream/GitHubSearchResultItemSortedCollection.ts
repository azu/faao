// MIT © 2017 azu
import { sortBy } from "lodash";
import { GitHubSearchResultItem } from "./GitHubSearchResultItem";
import {
    GitHubSearchResultItemCollection,
    GitHubSearchResultItemCollectionArgs
} from "./GitHubSearchResultItemCollection";
import { CollectionRole } from "./CollectionRole";
import { SearchFilter } from "./SearchFilter/SearchFilter";

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
export class GitHubSearchResultItemSortedCollection
    implements CollectionRole<GitHubSearchResultItem> {
    sortType: SortTypeArgs;
    private collection: GitHubSearchResultItemCollection;

    constructor(
        protected args: GitHubSearchResultItemSortedCollectionArgs<GitHubSearchResultItem>
    ) {
        this.collection = new GitHubSearchResultItemCollection({
            items: sort(args.items, args.sortType),
            filter: args.filter
        });
        this.sortType = args.sortType;
    }

    get items() {
        return this.collection.items;
    }

    get filter() {
        return this.collection.filter;
    }

    applySort(sortType: SortTypeArgs) {
        return new (this.constructor as any)({
            ...this,
            sortType: sortType,
            items: sort(this.collection.items, sortType)
        });
    }

    differenceCollection(collection: CollectionRole<GitHubSearchResultItem>) {
        return collection.differenceCollection(this.collection);
    }

    // implements
    get rawItemCount() {
        return this.collection.rawItemCount;
    }

    get itemCount() {
        return this.collection.itemCount;
    }

    applyFilter(filter: SearchFilter) {
        return this.collection.applyFilter(filter);
    }

    filterBySearchFilter(filter: SearchFilter) {
        return this.collection.filterBySearchFilter(filter);
    }

    includes(aItem: GitHubSearchResultItem) {
        return this.collection.includes(aItem);
    }

    mergeItems(items: GitHubSearchResultItem[]) {
        const savedItems = this.collection.rawItems.slice();
        const addingItems = items;
        const actualAdding: GitHubSearchResultItem[] = [];
        addingItems.forEach(addingItem => {
            const index = savedItems.findIndex(savedItem => {
                return savedItem.id.equals(addingItem.id);
            });
            if (index === -1) {
                actualAdding.push(addingItem);
                return;
            }
            const item = savedItems[index];
            if (addingItem.isLaterThan(item)) {
                savedItems.splice(index, 1);
                actualAdding.push(addingItem);
            }
        });
        const concatItems = savedItems.concat(actualAdding);
        return new GitHubSearchResultItemSortedCollection({
            ...this,
            items: concatItems
        });
    }

    clear() {
        return this.collection.clear();
    }

    getFirstItem() {
        return this.collection.getFirstItem();
    }

    getItemAtIndex(index: number) {
        return this.collection.getItemAtIndex(index);
    }

    getNextItem(currentItem: GitHubSearchResultItem) {
        return this.collection.getNextItem(currentItem);
    }

    getPrevItem(currentItem: GitHubSearchResultItem) {
        return this.collection.getPrevItem(currentItem);
    }

    findItemByPredicate(predicate: (item: GitHubSearchResultItem) => boolean) {
        return this.collection.findItemByPredicate(predicate);
    }

    removeItem(item: GitHubSearchResultItem) {
        return this.collection.removeItem(item);
    }

    sliceItemsFromCurrentItem(currentItem: GitHubSearchResultItem, length: number) {
        return this.collection.sliceItemsFromCurrentItem(currentItem, length);
    }
}
