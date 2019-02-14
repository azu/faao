// MIT © 2017 azu
import { GitHubSearchResultItem } from "./GitHubSearchResultItem";
import uniqBy from "lodash.uniqby";
import { SearchFilter } from "./SearchFilter/SearchFilter";

export interface GitHubSearchResultItemCollectionArgs<T> {
    items: T[];
    filter?: SearchFilter;
}

export class GitHubSearchResultItemCollection<T extends GitHubSearchResultItem> {
    protected readonly rawItems: T[];
    items: T[];
    filter?: SearchFilter;

    constructor(protected args: GitHubSearchResultItemCollectionArgs<T>) {
        this.rawItems = uniqBy(args.items, item => item.id.toValue());
        this.items = this.rawItems;
        if (args.filter) {
            this.applyFilter(args.filter);
        }
    }

    get rawItemCount(): number {
        return this.rawItems.length;
    }

    get itemCount(): number {
        return this.items.length;
    }

    applyFilter(filter: SearchFilter): void {
        this.filter = filter;
        this.items = this.filterBySearchFilter(filter);
    }

    filterBySearchFilter(filter: SearchFilter) {
        return this.rawItems.filter(item => {
            return filter.isMatch(item);
        });
    }

    includes(aItem: T): boolean {
        return this.rawItems.some(item => {
            return aItem.equals(item);
        });
    }

    mergeItems(items: T[]): GitHubSearchResultItemCollection<T> {
        const savedItems = this.rawItems.slice();
        const addingItems = items.slice();
        addingItems.forEach((addingItem, addingIndex) => {
            const index = savedItems.findIndex(savedItem => savedItem.id === addingItem.id);
            if (index === -1) {
                return;
            }
            const item = savedItems[index];
            if (addingItem.updatedAtDate > item.updatedAtDate) {
                savedItems.splice(index, 1);
            } else {
                addingItems.splice(addingIndex, 1);
            }
        });
        const concatItems = savedItems.concat(addingItems);
        return new GitHubSearchResultItemCollection(
            Object.assign({}, this.args, {
                items: concatItems
            })
        );
    }

    clear() {
        this.items = [];
    }

    /**
     * get method respect filter
     */
    getFirstItem(): T | undefined {
        return this.getItemAtIndex(0);
    }

    getItemAtIndex(index: number): T | undefined {
        return this.items[index];
    }

    getNextItem(currentItem: T): T | undefined {
        const index = this.items.findIndex(item => {
            return item.equals(currentItem);
        });
        return this.getItemAtIndex(index + 1);
    }

    getPrevItem(currentItem: T): T | undefined {
        const index = this.items.findIndex(item => {
            return item.equals(currentItem);
        });
        return this.getItemAtIndex(index - 1);
    }

    sliceItemsFromCurrentItem(currentItem: T, length: number): T[] {
        const index = this.items.findIndex(item => {
            return item.equals(currentItem);
        });
        console.log("match item", index);
        if (index === -1) {
            return [];
        }
        return this.items.slice(index, index + length);
    }
}
