// MIT © 2017 azu
import { GitHubSearchResultItem } from "./GitHubSearchResultItem";
import { uniqBy } from "lodash";
import { SearchFilter } from "./SearchFilter/SearchFilter";
import { splice } from "@immutable-array/prototype";
import { CollectionRole } from "./CollectionRole";

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

export interface GitHubSearchResultItemCollectionArgs<T> {
    items: T[];
    filter?: SearchFilter;
}

export class GitHubSearchResultItemCollection implements CollectionRole<GitHubSearchResultItem> {
    readonly rawItems: GitHubSearchResultItem[];
    readonly items: GitHubSearchResultItem[];
    readonly filter?: SearchFilter;

    constructor(protected args: GitHubSearchResultItemCollectionArgs<GitHubSearchResultItem>) {
        this.rawItems = args.items;
        this.items = uniqBy(args.items, item => item.id.toValue());
        if (args.filter) {
            this.filter = args.filter;
            this.items = this.filterBySearchFilter(args.filter);
        }
    }

    get rawItemCount(): number {
        return this.rawItems.length;
    }

    get itemCount(): number {
        return this.items.length;
    }

    applyFilter(filter: SearchFilter) {
        return new (this.constructor as any)({
            ...this,
            filter,
            items: this.filterBySearchFilter(filter)
        });
    }

    filterBySearchFilter(filter: SearchFilter) {
        return this.rawItems.filter(item => {
            return filter.isMatch(item);
        });
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
    differenceCollection(collection: CollectionRole<GitHubSearchResultItem>) {
        return new GitHubSearchResultItemCollection({
            ...this,
            items: differenceWith(collection.items, this.items)
        });
    }

    mergeItems(items: GitHubSearchResultItem[]): this {
        const savedItems = this.rawItems.slice();
        const addingItems = items.slice();
        addingItems.forEach((addingItem, addingIndex) => {
            const index = savedItems.findIndex(savedItem => savedItem.id === addingItem.id);
            if (index === -1) {
                return;
            }
            const item = savedItems[index];
            if (addingItem.isLaterThan(item)) {
                savedItems.splice(index, 1);
            } else {
                addingItems.splice(addingIndex, 1);
            }
        });
        const concatItems = savedItems.concat(addingItems);
        return new (this.constructor as any)({
            ...this,
            items: concatItems
        });
    }

    clear() {
        return new (this.constructor as any)({
            ...this,
            items: []
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

    removeItem(item: GitHubSearchResultItem): this {
        const index = this.items.findIndex(inItem => inItem.equals(item));
        if (index === -1) {
            return this;
        }
        return new (this.constructor as any)({
            ...this,
            items: splice(this.items, index, 1)
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
}
