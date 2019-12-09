import { SearchFilter } from "./SearchFilter/SearchFilter";
import { Identifier } from "../Entity";
import { from } from "fromfrom";
import { Class } from "type-fest";
import { splice } from "@immutable-array/splice";
import { SortType, SortTypeArgs } from "./GitHubSearchResultItemSortedCollection";
import { uniqBy } from "lodash";
import { GitHubEventSortedCollectionJSON } from "./GitHubEventSortedCollection";
import { GitHubActiveItem } from "../App/Activity/GitHubActiveItem";

export function sort<T extends SortedCollectionItem>(
    items: T[],
    filter: SearchFilter,
    sortType: SortTypeArgs
): T[] {
    return from(items)
        .filter(item => {
            return filter.isMatch(item);
        })
        .sortByDescending(item => {
            if (sortType === SortType.created) {
                return item.created_at;
            } else if (sortType === SortType.updated) {
                return item.updated_at;
            }
            return item.updated_at;
        })
        .distinct()
        .toArray();
}

export function filter<T extends SortedCollectionItem>(
    items: T[],
    searchFilter: SearchFilter
): T[] {
    return items.filter(item => {
        return searchFilter.isMatch(item);
    });
}

/**
 * Uniq(A + B - Duplicated AB)
 * @param arrayA
 * @param arrayB
 */
const differenceWith = <T extends SortedCollectionItem>(arrayA: T[], arrayB: T[]): T[] => {
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

export type SortedCollectionItemJSON = {
    id: string;
    title: string;
    body: string | null;
    shortPath: string;
    avatarUrl: string;
    created_at: string;
    updated_at: string;
    html_url: string;
};

export const isSortedCollectionItem = (item: any): item is SortedCollectionItem => {
    return (
        item.id && item.title !== undefined && item.avatarUrl && item.html_url && item.updated_at
    );
};
export type SortedCollectionItem = {
    id: Identifier<any>;
    title: string;
    body: string | null;
    shortPath: string;
    avatarUrl: string;
    equals(aTarget: any): boolean;
    isLaterThan(aTarget: any): boolean;
    includes(aTarget: string): boolean;
    created_at: string;
    updated_at: string;
    html_url: string;
    updatedAtDate: Date;
    toJSON(): {};
};

export type SortedCollectionItemArgs<T extends SortedCollectionItem, Type extends string> = {
    readonly type: Type;
    readonly rawItems: T[];
    readonly sortType: SortTypeArgs;
    readonly filter: SearchFilter;
};

export abstract class SortedCollection<T extends SortedCollectionItem, Type extends string> {
    readonly type: Type;
    readonly sortType: SortTypeArgs;
    readonly rawItems: SortedCollectionItem[];
    readonly items: SortedCollectionItem[];
    readonly filter: SearchFilter;

    constructor(args: SortedCollectionItemArgs<T, Type>) {
        this.type = args.type;
        this.sortType = args.sortType;
        this.rawItems = args.rawItems;
        this.items = sort(args.rawItems, args.filter, args.sortType);
        this.filter = args.filter;
    }

    protected get typedRawItems(): T[] {
        return this.rawItems as T[];
    }

    // implements
    get rawItemCount() {
        return this.rawItems.length;
    }

    get itemCount() {
        return this.items.length;
    }

    applySort(sortType: SortTypeArgs) {
        return new ((this.constructor as Class<this>) as Class<this>)({
            ...this,
            sortType
        });
    }

    applyFilter(filter: SearchFilter) {
        return new ((this.constructor as Class<this>) as Class<this>)({
            ...this,
            filter
        });
    }

    filterBySearchFilter(searchFilter: SearchFilter) {
        return filter(this.items, searchFilter);
    }

    includes(aItem: SortedCollectionItem): boolean {
        return this.items.some(item => {
            return aItem.equals(item);
        });
    }

    /**
     * return difference item collection between self and argument collection
     * @param collection
     */
    differenceCollection(collection: SortedCollection<any, any>) {
        return new (this.constructor as Class<this>)({
            ...this,
            rawItems: differenceWith(collection.rawItems, this.rawItems)
        });
    }

    mergeItems(items: SortedCollectionItem[]) {
        const savedItems = this.rawItems.slice();
        const addingItems = items;
        const actualAdding: SortedCollectionItem[] = [];
        addingItems.forEach(addingItem => {
            const index = savedItems.findIndex(savedItem => {
                return savedItem.equals(addingItem);
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
        return new (this.constructor as Class<this>)({
            ...this,
            rawItems: concatItems
        });
    }

    clear() {
        return new (this.constructor as Class<this>)({
            ...this,
            rawItems: []
        });
    }

    /**
     * get method respect filter
     */
    getFirstItem(): SortedCollectionItem | undefined {
        return this.getItemAtIndex(0);
    }

    getItemAtIndex(index: number): SortedCollectionItem | undefined {
        return this.items[index];
    }

    getNextItem(
        currentItem: SortedCollectionItem | GitHubActiveItem
    ): SortedCollectionItem | undefined {
        const index = this.items.findIndex(item => {
            return item.equals(currentItem);
        });
        return this.getItemAtIndex(index + 1);
    }

    getPrevItem(
        currentItem: SortedCollectionItem | GitHubActiveItem
    ): SortedCollectionItem | undefined {
        const index = this.items.findIndex(item => {
            return item.equals(currentItem);
        });
        return this.getItemAtIndex(index - 1);
    }

    // TODO: should be more reasonable?
    // find alias
    findItemByPredicate(predicate: (item: SortedCollectionItem) => boolean) {
        return this.items.find(predicate);
    }

    removeItem(item: SortedCollectionItem) {
        const index = this.rawItems.findIndex(inItem => inItem.equals(item));
        if (index === -1) {
            return this;
        }
        return new (this.constructor as Class<this>)({
            ...this,
            rawItems: splice(this.rawItems, index, 1)
        });
    }

    sliceItemsFromCurrentItem(
        currentItem: SortedCollectionItem | GitHubActiveItem,
        length: number
    ): SortedCollectionItem[] {
        const index = this.items.findIndex(item => {
            return item.equals(currentItem);
        });
        if (index === -1) {
            return [];
        }
        // reverse
        if (length < 0) {
            return this.items.slice(Math.max(index + length - 1, 0), Math.max(index, 0));
        } else {
            return this.items.slice(index + 1, index + length + 1);
        }
    }

    equals(collection?: SortedCollection<T, string>): boolean {
        if (collection === undefined) {
            return false;
        }
        return collection.rawItems === this.rawItems;
    }

    abstract toJSON(): object;
}
