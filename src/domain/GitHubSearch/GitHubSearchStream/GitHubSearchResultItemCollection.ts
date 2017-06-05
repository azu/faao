// MIT © 2017 azu
import { GitHubSearchResultItem } from "./GitHubSearchResultItem";
import uniqBy from "lodash.uniqby";

export class GitHubSearchResultItemCollection<T extends GitHubSearchResultItem> {
    readonly items: T[];

    constructor(items: T[]) {
        this.items = uniqBy(items, "id");
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
