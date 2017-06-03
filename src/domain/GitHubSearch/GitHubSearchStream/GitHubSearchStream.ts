// MIT © 2017 azu
import { GitHubSearchResult } from "./GitHubSearchResult";
import { GitHubSearchResultItem, Item } from "./GitHubSearchResultItem";
import { GitHubSearchQuery } from "../GitHubSearchList/GitHubSearchQuery";
import uniqBy from "lodash.uniqby"

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
    private lastResult: GitHubSearchResult | undefined;

    constructor(items: GitHubSearchResultItem[]) {
        this.id = `GitHubSearchStream${id++}`;
        this.items = items;
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
        const matchIds = [firstItem.id, lastItem.id];
        return this.items.some(item => {
            return matchIds.includes(item.id);
        })
    }

    mergeResult(result: GitHubSearchResult) {
        this.items = uniqBy(this.items.concat(result.items), "id");
        this.lastResult = result;
    }

    toJSON(): GitHubSearchStreamJSON {
        return {
            items: this.items.map(item => {
                return item.toJSON();
            })
        }
    }

    clear() {
        this.items = [];
    }
}