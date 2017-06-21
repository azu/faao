// MIT © 2017 azu
import {
    GitHubSearchStream,
    GitHubSearchStreamJSON
} from "../GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import {
    GitHubSearchResultItem,
    GitHubSearchResultItemJSON
} from "../GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import {
    GitHubSearchQuery,
    GitHubSearchQueryJSON
} from "../GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import {
    GitHubSearchList,
    GitHubSearchListJSON
} from "../GitHubSearch/GitHubSearchList/GitHubSearchList";
import { ActivityHistory, ActivityHistoryItem, ActivityHistoryJSON } from "./ActivityHistory";

export interface AppUserActivityArgs {
    itemHistory: ActivityHistory;
}

export interface AppUserActivityJSON {
    itemHistory: ActivityHistoryJSON;
    openedStream?: GitHubSearchStreamJSON;
    openedItem?: GitHubSearchResultItemJSON;
    openedQuery?: GitHubSearchQueryJSON;
    openedSearchList?: GitHubSearchListJSON;
}

export class AppUserActivity {
    itemHistory: ActivityHistory;
    openedStream?: GitHubSearchStream;
    openedItem?: GitHubSearchResultItem;
    openedQuery?: GitHubSearchQuery;
    openedSearchList?: GitHubSearchList;

    constructor(args: AppUserActivityArgs) {
        this.itemHistory = args.itemHistory;
    }

    /**
     * active search is SearchList mode or SearchQuery mode.
     */
    get activeSearch(): GitHubSearchList | GitHubSearchQuery | undefined {
        if (this.activeSearchList && !this.activeQuery) {
            return this.activeSearchList;
        } else if (this.activeQuery) {
            return this.activeQuery;
        }
        return;
    }

    get activeQuery(): GitHubSearchQuery | undefined {
        return this.openedQuery;
    }

    get activeSearchList(): GitHubSearchList | undefined {
        return this.openedSearchList;
    }

    get activeStream(): GitHubSearchStream | undefined {
        return this.openedStream;
    }

    get activeItem(): GitHubSearchResultItem | undefined {
        return this.openedItem;
    }

    activateStream(stream: GitHubSearchStream) {
        this.openedStream = stream;
    }

    activateItem(item: GitHubSearchResultItem) {
        this.openedItem = item;
        this.itemHistory.addItem(
            new ActivityHistoryItem({
                id: item.itemId,
                timeStamp: Date.now()
            })
        );
    }

    activateSearchList(searchList: GitHubSearchList) {
        this.openedSearchList = searchList;
        this.openedQuery = undefined;
    }

    activateQuery(searchList: GitHubSearchList, query: GitHubSearchQuery) {
        this.openedSearchList = searchList;
        this.openedQuery = query;
    }

    static fromJSON(json: AppUserActivityJSON): AppUserActivity {
        const proto = Object.create(AppUserActivity.prototype);
        return Object.assign(proto, {
            itemHistory: ActivityHistory.fromJSON(json.itemHistory),
            openedStream: json.openedStream
                ? GitHubSearchStream.fromJSON(json.openedStream)
                : undefined,
            openedItem: json.openedItem
                ? GitHubSearchResultItem.fromJSON(json.openedItem)
                : undefined,
            openedQuery: json.openedQuery
                ? GitHubSearchQuery.fromJSON(json.openedQuery)
                : undefined,
            openedSearchList: json.openedSearchList
                ? GitHubSearchList.fromJSON(json.openedSearchList)
                : undefined
        });
    }

    toJSON(): AppUserActivityJSON {
        return {
            itemHistory: this.itemHistory.toJSON(),
            openedStream: this.openedStream ? this.openedStream.toJSON() : undefined,
            openedItem: this.openedItem ? this.openedItem.toJSON() : undefined,
            openedQuery: this.openedQuery ? this.openedQuery.toJSON() : undefined,
            openedSearchList: this.openedSearchList ? this.openedSearchList.toJSON() : undefined
        };
    }
}
