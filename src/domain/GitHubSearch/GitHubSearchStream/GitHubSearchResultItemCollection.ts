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
    filter: SearchFilter;

    constructor(private args: GitHubSearchResultItemCollectionArgs<T>) {
        this.rawItems = uniqBy(args.items, item => item.id.toValue());
        this.items = this.rawItems;
        if (args.filter) {
            this.applyFilter(args.filter);
        }
    }

    applyFilter(filter: SearchFilter): void {
        this.filter = filter;
        this.items = this.filterBySearchFilter(filter);
    }

    filterBySearchFilter(filter: SearchFilter) {
        return this.rawItems.filter(item => {
            return filter.items.every((filterItem): boolean => {
                const itemValue: any = (item as any)[filterItem.field];
                if (filterItem.type === "in") {
                    return item.includes(filterItem.value);
                } else if (filterItem.type === "nin") {
                    return item.includes(filterItem.value) === false;
                } else if (filterItem.type === "=") {
                    return itemValue === filterItem.value;
                } else if (filterItem.type === ">") {
                    return itemValue > filterItem.value;
                } else if (filterItem.type === ">=") {
                    return itemValue >= filterItem.value;
                } else if (filterItem.type === "<") {
                    return itemValue < filterItem.value;
                } else if (filterItem.type === "<=") {
                    return itemValue <= filterItem.value;
                }
                return false;
            });
        });
    }

    includes(aItem: T): boolean {
        return this.rawItems.some(item => {
            return aItem.equals(item);
        });
    }

    mergeItems(items: T[]): GitHubSearchResultItemCollection<T> {
        const concatItems = this.rawItems.concat(items);
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
}
