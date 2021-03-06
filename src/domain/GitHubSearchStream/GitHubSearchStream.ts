// MIT © 2017 azu
import { GitHubSearchResult } from "./GitHubSearchResult";
import { GitHubSearchResultItem } from "./GitHubSearchResultItem";
import {
    GitHubSearchResultItemSortedCollection,
    GitHubSearchResultItemSortedCollectionJSON
} from "./GitHubSearchResultItemSortedCollection";
import { SearchFilter } from "./SearchFilter/SearchFilter";
import { Identifier } from "../Entity";
import {
    GitHubEventSortedCollection,
    GitHubEventSortedCollectionJSON
} from "./GitHubEventSortedCollection";
import { SortedCollectionItem } from "./SortedCollection";

export interface GitHubSearchStreamJSON {
    id: string;
    itemSortedCollection:
        | GitHubSearchResultItemSortedCollectionJSON
        | GitHubEventSortedCollectionJSON;
}

export interface GitHubSearchStreamArgs {
    id: Identifier<GitHubSearchStream>;
    itemSortedCollection: GitHubSearchResultItemSortedCollection | GitHubEventSortedCollection;
}

type ResultItem = never;
type SearchResult = never;
type SearchResultCollection = never;

/**
 * Stream has items
 * It is saved with query.
 */
export class GitHubSearchStream {
    id: Identifier<GitHubSearchStream>;
    itemSortedCollection: GitHubSearchResultItemSortedCollection | GitHubEventSortedCollection;

    constructor(args: GitHubSearchStreamArgs) {
        this.id = args.id;
        this.itemSortedCollection = args.itemSortedCollection;
    }

    /**
     * sort/filtered items
     */
    get items() {
        return this.itemSortedCollection.items;
    }

    get filterWord() {
        if (!this.itemSortedCollection.filter) {
            return undefined;
        }
        return this.itemSortedCollection.filter.filterText;
    }

    get hasResultAtLeastOne(): boolean {
        return this.itemSortedCollection.itemCount > 0;
    }

    applyFilterToStream(filter: SearchFilter) {
        return new GitHubSearchStream({
            ...this,
            itemSortedCollection: this.itemSortedCollection.applyFilter(filter)
        });
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

    removeItemFromStream(item: SortedCollectionItem) {
        return new GitHubSearchStream({
            ...this,
            itemSortedCollection: this.itemSortedCollection.removeItem(item)
        });
    }

    mergeStream(stream: GitHubSearchStream) {
        return new GitHubSearchStream({
            ...this,
            itemSortedCollection: this.itemSortedCollection.mergeItems(stream.items)
        });
    }

    mergeResult(result: GitHubSearchResult) {
        return new GitHubSearchStream({
            ...this,
            itemSortedCollection: this.itemSortedCollection.mergeItems(result.items)
        });
    }

    clear() {
        return new GitHubSearchStream({
            ...this,
            itemSortedCollection: this.itemSortedCollection.clear()
        });
    }

    equals(entity: GitHubSearchStream): boolean {
        return this.id.equals(entity.id);
    }

    static fromJSON(json: GitHubSearchStreamJSON): GitHubSearchStream {
        return new GitHubSearchStream({
            id: new Identifier<GitHubSearchStream>(json.id),
            itemSortedCollection: (() => {
                if (json.itemSortedCollection.type === "GitHubEventSortedCollection") {
                    return GitHubEventSortedCollection.fromJSON(json.itemSortedCollection);
                } else if (
                    json.itemSortedCollection.type === "GitHubSearchResultItemSortedCollection"
                ) {
                    return GitHubSearchResultItemSortedCollection.fromJSON(
                        json.itemSortedCollection
                    );
                }
                return fail(json.itemSortedCollection);
            })()
        });
    }

    toJSON(): GitHubSearchStreamJSON {
        return {
            id: this.id.toValue(),
            itemSortedCollection: this.itemSortedCollection.toJSON()
        };
    }
}

function fail(...args: never[]): never {
    throw new Error("Unhandled type:" + args);
}
