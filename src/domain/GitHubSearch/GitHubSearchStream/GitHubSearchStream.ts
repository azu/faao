// MIT © 2017 azu
import { GitHubSearchResult } from "./GitHubSearchResult";
import { GitHubSearchResultItem, Item } from "./GitHubSearchResultItem";
import { GitHubSearchQuery } from "../GitHubSearchList/GitHubSearchQuery";
import uniqBy from "lodash.uniqby"
import { GitHubSearchResultItemCollection } from "./GitHubSearchResultItemCollection";
import {
    GitHubSearchResultItemSortedCollection,
    SortType,
    SortTypeArgs
} from "./GitHubSearchResultItemSortedCollection";

let id = 0;

export interface GitHubSearchStreamJSON {
    items: Item[]
}

/**
 * Stream has items
 * It is saved with query.
 */
export class GitHubSearchStream {
    id: string;
    items: GitHubSearchResultItem[];
    itemSortedCollection: GitHubSearchResultItemSortedCollection;

    constructor(items: GitHubSearchResultItem[]) {
        this.id = `GitHubSearchStream${id++}`;
        this.items = items;
        this.itemSortedCollection = new GitHubSearchResultItemSortedCollection(items, "updated");
    }

    /**
     * This stream has the result, return true.
     * It means that this stream would not to fetch next result.
     * @param result
     * @returns {boolean}
     */
    alreadyHasResult(result: GitHubSearchResult): boolean {
        // check first item or last item is included in this stream
        const [firstItem, lastItem] = result.items;
        const matchingItems = [firstItem, lastItem]
            .filter(item => item !== undefined);
        return matchingItems.some(matchingItem => {
            return this.itemSortedCollection.includes(matchingItem);
        });
    }

    mergeResult(result: GitHubSearchResult) {
        this.itemSortedCollection = this.itemSortedCollection.mergeItems(result.items);
    }

    toJSON(): GitHubSearchStreamJSON {
        return {
            items: this.itemSortedCollection.items.map(item => {
                return item.toJSON();
            })
        }
    }

    clear() {
        this.items = [];
        this.itemSortedCollection = new GitHubSearchResultItemSortedCollection([], "updated");
    }
}