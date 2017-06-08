// MIT © 2017 azu
import { GitHubSearchResultItem } from "./GitHubSearchResultItem";
import uniqBy from "lodash.uniqby";
import { SearchFilter } from "./SearchFilter/SearchFilter";

export class GitHubSearchResultItemCollection<T extends GitHubSearchResultItem> {
    readonly items: T[];

    constructor(items: T[]) {
        this.items = uniqBy(items, "id");
    }

    filterBySearchFilter(filters: SearchFilter[]) {
        return this.items.filter(item => {
            return filters.every((filter): boolean => {
                const itemValue: any = (item as any)[filter.field];
                if (filter.type === "in") {
                    return item.includes(filter.value);
                } else if (filter.type === "=") {
                    return itemValue === filter.value;
                } else if (filter.type === ">") {
                    return itemValue > filter.value;
                } else if (filter.type === ">=") {
                    return itemValue >= filter.value;
                } else if (filter.type === "<") {
                    return itemValue < filter.value;
                } else if (filter.type === "<=") {
                    return itemValue <= filter.value;
                }
                return false;
            });
        });
    }

    includes(aItem: T): boolean {
        return this.items.some(item => {
            return aItem.equals(item);
        });
    }

    mergeItems(this: GitHubSearchResultItemCollection<T>, items: T[]): GitHubSearchResultItemCollection<T> {
        return new GitHubSearchResultItemCollection(this.items.concat(items));
    }

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
