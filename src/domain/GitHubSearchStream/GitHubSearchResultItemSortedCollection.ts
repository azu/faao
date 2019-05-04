// MIT © 2017 azu
import { sortBy } from "lodash";
import { GitHubSearchResultItem, GitHubSearchResultItemJSON } from "./GitHubSearchResultItem";
import { SearchFilter, SearchFilterJSON } from "./SearchFilter/SearchFilter";
import { splice } from "@immutable-array/splice";
import { uniqBy } from "lodash";
import { from } from "fromfrom";

export const SortType = {
    updated: "updated",
    created: "updated"
};
export type SortTypeArgs = "updated" | "created";

/**
 * Uniq(A + B - Duplicated AB)
 * @param arrayA
 * @param arrayB
 */
const differenceWith = <T extends GitHubSearchResultItem>(arrayA: T[], arrayB: T[]) => {
    const arraysAB = [arrayA, arrayB];
    const arraysBA = [arrayB, arrayA];
    const reduce = (arrays: T[][]) => {
        return arrays.reduce(function(a, b) {
            return a.filter(function(value) {
                return !b.some(item => item.equals(value));
            });
        });
    };
    const AB = reduce(arraysAB);
    const BA = reduce(arraysBA);
    return uniqBy(AB.concat(BA), item => item.id.toValue());
};

export function sort<T extends GitHubSearchResultItem>(items: T[], sortType: SortTypeArgs): T[] {
    if (sortType === SortType.created) {
        return sortBy(items, item => item.createdAtDate).reverse();
    } else if (sortType === SortType.updated) {
        return sortBy(items, item => item.updatedAtDate).reverse();
    }
    return items;
}

export function filter<T extends GitHubSearchResultItem>(
    items: T[],
    searchFilter: SearchFilter
): T[] {
    return items.filter(item => {
        return searchFilter.isMatch(item);
    });
}

export type GitHubSearchResultItemSortedCollectionArgs = {
    readonly rawItems: GitHubSearchResultItem[];
    readonly sortType: SortTypeArgs;
    readonly filter: SearchFilter;
};

export interface GitHubSearchResultItemSortedCollectionJSON {
    rawItems: GitHubSearchResultItemJSON[];
    filter: SearchFilterJSON;
    sortType: SortTypeArgs;
}

/**
 * Always sorted items
 */
export class GitHubSearchResultItemSortedCollection {
    readonly sortType: SortTypeArgs;
    readonly rawItems: GitHubSearchResultItem[];
    readonly items: GitHubSearchResultItem[];
    readonly filter: SearchFilter;

    constructor(args: GitHubSearchResultItemSortedCollectionArgs) {
        this.sortType = args.sortType;
        this.rawItems = args.rawItems;
        this.items = from(args.rawItems)
            .filter(item => {
                return args.filter.isMatch(item);
            })
            .sortByDescending(item => {
                if (args.sortType === SortType.created) {
                    return item.createdAtDate;
                } else if (args.sortType === SortType.updated) {
                    return item.updatedAtDate;
                }
                return item.updatedAtDate;
            })
            .distinct()
            .toArray();
        this.filter = args.filter;
    }

    // implements
    get rawItemCount() {
        return this.rawItems.length;
    }

    get itemCount() {
        return this.items.length;
    }

    applySort(sortType: SortTypeArgs) {
        return new GitHubSearchResultItemSortedCollection({
            ...this,
            sortType
        });
    }

    applyFilter(filter: SearchFilter) {
        return new GitHubSearchResultItemSortedCollection({
            ...this,
            filter
        });
    }

    filterBySearchFilter(searchFilter: SearchFilter) {
        return filter(this.rawItems, searchFilter);
    }

    includes(aItem: GitHubSearchResultItem): boolean {
        return this.rawItems.some(item => {
            return aItem.equals(item);
        });
    }

    /**
     * return difference item collection between self and argument collection
     * @param collection
     */
    differenceCollection(collection: GitHubSearchResultItemSortedCollection) {
        return new GitHubSearchResultItemSortedCollection({
            ...this,
            rawItems: differenceWith(collection.rawItems, this.rawItems)
        });
    }

    mergeItems(items: GitHubSearchResultItem[]) {
        const savedItems = this.rawItems.slice();
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
            rawItems: concatItems
        });
    }

    clear() {
        return new GitHubSearchResultItemSortedCollection({
            ...this,
            rawItems: []
        });
    }

    /**
     * get method respect filter
     */
    getFirstItem(): GitHubSearchResultItem | undefined {
        return this.getItemAtIndex(0);
    }

    getItemAtIndex(index: number): GitHubSearchResultItem | undefined {
        return this.items[index];
    }

    getNextItem(currentItem: GitHubSearchResultItem): GitHubSearchResultItem | undefined {
        const index = this.items.findIndex(item => {
            return item.equals(currentItem);
        });
        return this.getItemAtIndex(index + 1);
    }

    getPrevItem(currentItem: GitHubSearchResultItem): GitHubSearchResultItem | undefined {
        const index = this.items.findIndex(item => {
            return item.equals(currentItem);
        });
        return this.getItemAtIndex(index - 1);
    }

    // TODO: should be more reasonable?
    // find alias
    findItemByPredicate(predicate: (item: GitHubSearchResultItem) => boolean) {
        return this.items.find(predicate);
    }

    removeItem(item: GitHubSearchResultItem) {
        const index = this.rawItems.findIndex(inItem => inItem.equals(item));
        if (index === -1) {
            return this;
        }
        return new GitHubSearchResultItemSortedCollection({
            ...this,
            rawItems: splice(this.rawItems, index, 1)
        });
    }

    sliceItemsFromCurrentItem(
        currentItem: GitHubSearchResultItem,
        length: number
    ): GitHubSearchResultItem[] {
        const index = this.items.findIndex(item => {
            return item.equals(currentItem);
        });
        if (index === -1) {
            return [];
        }
        return this.items.slice(index + 1, index + length);
    }

    equals(collection?: GitHubSearchResultItemSortedCollection): boolean {
        if (collection === undefined) {
            return false;
        }
        return collection.rawItems === this.rawItems;
    }

    static fromJSON(
        json: GitHubSearchResultItemSortedCollectionJSON
    ): GitHubSearchResultItemSortedCollection {
        return new GitHubSearchResultItemSortedCollection({
            ...this,
            sortType: json.sortType,
            rawItems: json.rawItems.map(item => GitHubSearchResultItem.fromJSON(item)),
            filter: json.filter ? SearchFilter.fromJSON(json.filter) : new SearchFilter()
        });
    }

    toJSON(): GitHubSearchResultItemSortedCollectionJSON {
        return {
            ...this,
            sortType: this.sortType,
            rawItems: this.rawItems.map(item => item.toJSON()),
            filter: this.filter ? this.filter.toJSON() : undefined
        };
    }
}
