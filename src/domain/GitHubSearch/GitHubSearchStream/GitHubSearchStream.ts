// MIT © 2017 azu
import { GitHubSearchResult } from "./GitHubSearchResult";
import { GitHubSearchResultItem, GitHubSearchResultItemJSON } from "./GitHubSearchResultItem";
import { GitHubSearchResultItemSortedCollection } from "./GitHubSearchResultItemSortedCollection";
import { GitHubSearchStreamFactory } from "./GitHubSearchStreamFactory";
import { SearchFilter } from "./SearchFilter/SearchFilter";

const ulid = require("ulid");

export interface GitHubSearchStreamJSON {
    items: GitHubSearchResultItemJSON[];
}

export interface GitHubSearchStreamArgs {
    items: GitHubSearchResultItem[];
    filter?: SearchFilter;
}

/**
 * Stream has items
 * It is saved with query.
 */
export class GitHubSearchStream {
    id: string;
    filter?: SearchFilter;
    // no filter | no sort item
    items: GitHubSearchResultItem[];
    itemSortedCollection: GitHubSearchResultItemSortedCollection;

    constructor(args: GitHubSearchStreamArgs) {
        this.id = ulid();
        this.items = args.items;
        this.filter = args.filter;
        this.itemSortedCollection = new GitHubSearchResultItemSortedCollection(
            args.items,
            "updated"
        );
    }

    /**
     * sort/filtered items
     */
    get sortedItems() {
        if (!this.filter) {
            return this.itemSortedCollection.items;
        }
        return this.itemSortedCollection.filterBySearchFilter(this.filter);
    }

    get filterWord() {
        if (!this.filter) {
            return undefined;
        }
        return this.filter.filterText;
    }

    setFilters(filter: SearchFilter) {
        this.filter = filter;
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
        const matchingItems = [firstItem, lastItem].filter(item => item !== undefined);
        return matchingItems.some(matchingItem => {
            return this.itemSortedCollection.includes(matchingItem);
        });
    }

    mergeStream(stream: GitHubSearchStream) {
        this.itemSortedCollection = this.itemSortedCollection.mergeItems(stream.sortedItems);
    }

    mergeResult(result: GitHubSearchResult) {
        this.itemSortedCollection = this.itemSortedCollection.mergeItems(result.items);
    }

    static fromJSON(json: GitHubSearchStreamJSON): GitHubSearchStream {
        return GitHubSearchStreamFactory.createFromStreamJSON(json);
    }

    toJSON(): GitHubSearchStreamJSON {
        return {
            items: this.itemSortedCollection.items.map(item => {
                return item.toJSON();
            })
        };
    }

    clear() {
        this.items = [];
        this.itemSortedCollection = new GitHubSearchResultItemSortedCollection([], "updated");
    }
}
