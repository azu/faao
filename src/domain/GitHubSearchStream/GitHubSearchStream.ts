// MIT © 2017 azu
import { GitHubSearchResult } from "./GitHubSearchResult";
import { GitHubSearchResultItem, GitHubSearchResultItemJSON } from "./GitHubSearchResultItem";
import { GitHubSearchResultItemSortedCollection } from "./GitHubSearchResultItemSortedCollection";
import { SearchFilter } from "./SearchFilter/SearchFilter";
import { Identifier } from "../Entity";

export interface GitHubSearchStreamJSON {
    id: string;
    items: GitHubSearchResultItemJSON[];
}

export interface GitHubSearchStreamArgs {
    id: Identifier<GitHubSearchStream>;
    itemSortedCollection: GitHubSearchResultItemSortedCollection;
}

/**
 * Stream has items
 * It is saved with query.
 */
export class GitHubSearchStream {
    id: Identifier<GitHubSearchStream>;
    itemSortedCollection: GitHubSearchResultItemSortedCollection;

    constructor(args: GitHubSearchStreamArgs) {
        this.id = args.id;
        this.itemSortedCollection = args.itemSortedCollection;
    }

    /**
     * sort/filtered items
     */
    get items(): GitHubSearchResultItem[] {
        return this.itemSortedCollection.items;
    }

    get filterWord() {
        if (!this.itemSortedCollection.filter) {
            return undefined;
        }
        return this.itemSortedCollection.filter.filterText;
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

    removeItemFromStream(item: GitHubSearchResultItem) {
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

    equals(entity: GitHubSearchStream): boolean {
        return this.id.equals(entity.id);
    }

    static fromJSON(json: GitHubSearchStreamJSON): GitHubSearchStream {
        return new GitHubSearchStream({
            id: new Identifier<GitHubSearchStream>(json.id),
            itemSortedCollection: new GitHubSearchResultItemSortedCollection({
                items: json.items.map(rawItem => {
                    return GitHubSearchResultItem.fromJSON(rawItem);
                }),
                sortType: "updated"
            })
        });
    }

    toJSON(): GitHubSearchStreamJSON {
        return {
            id: this.id.toValue(),
            items: this.items.map(item => {
                return item.toJSON();
            })
        };
    }

    clear() {
        return new GitHubSearchStream({
            ...this,
            itemSortedCollection: this.itemSortedCollection.clear()
        });
    }
}
