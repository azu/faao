// MIT © 2017 azu
import { GitHubSearchStream } from "../GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import {
    GitHubSearchResultItem,
    GitHubSearchResultItemJSON
} from "../GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import {
    GitHubSearchQuery,
    GitHubSearchQueryJSON
} from "../GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchList } from "../GitHubSearch/GitHubSearchList/GitHubSearchList";
import { ActivityHistory, ActivityHistoryItem, ActivityHistoryJSON } from "./ActivityHistory";
import { Identifier } from "../Entity";

export interface AppUserActivityArgs {
    itemHistory: ActivityHistory;
}

/**
 * Note: Entity should not reference to other entity.
 * Insteadof it, should reference by id.(soft link)
 * http://domain-driven-design.3010926.n2.nabble.com/Can-an-Entity-be-Shared-across-many-Aggregates-td7579277.html
 * https://softwareengineering.stackexchange.com/questions/328571/ddd-is-it-correct-for-a-root-aggregate-to-hold-a-reference-to-another-root-aggr
 */
export interface AppUserActivityJSON {
    itemHistory: ActivityHistoryJSON;
    // entity
    openedStreamId?: string;
    openedSearchListId?: string;
    // value object
    openedItem?: GitHubSearchResultItemJSON;
    openedQuery?: GitHubSearchQueryJSON;
}

export class AppUserActivity {
    itemHistory: ActivityHistory;
    openedStreamId?: Identifier<GitHubSearchStream>;
    openedSearchListId?: Identifier<GitHubSearchList>;
    // value object
    openedItem?: GitHubSearchResultItem;
    openedQuery?: GitHubSearchQuery;

    constructor(args: AppUserActivityArgs) {
        this.itemHistory = args.itemHistory;
    }

    /**
     * active search is SearchList mode or SearchQuery mode.
     */
    get activeSearch(): Identifier<GitHubSearchList> | GitHubSearchQuery | undefined {
        if (this.activeSearchListId && !this.activeQuery) {
            return this.activeSearchListId;
        } else if (this.activeQuery) {
            return this.activeQuery;
        }
        return;
    }

    get activeSearchListId(): Identifier<GitHubSearchList> | undefined {
        return this.openedSearchListId;
    }

    get activeStreamId(): Identifier<GitHubSearchStream> | undefined {
        return this.openedStreamId;
    }

    get activeQuery(): GitHubSearchQuery | undefined {
        return this.openedQuery;
    }

    get activeItem(): GitHubSearchResultItem | undefined {
        return this.openedItem;
    }

    activateStream(stream: GitHubSearchStream) {
        this.openedStreamId = stream.id;
    }

    activateItem(item: GitHubSearchResultItem) {
        this.openedItem = item;
        this.itemHistory.addItem(
            new ActivityHistoryItem({
                id: item.id,
                timeStamp: Date.now()
            })
        );
    }

    activateSearchList(searchList: GitHubSearchList) {
        this.openedSearchListId = searchList.id;
        this.openedQuery = undefined;
    }

    activateQuery(searchList: GitHubSearchList, query: GitHubSearchQuery) {
        this.openedSearchListId = searchList.id;
        this.openedQuery = query;
    }

    static fromJSON(json: AppUserActivityJSON): AppUserActivity {
        const proto = Object.create(AppUserActivity.prototype);
        return Object.assign(proto, {
            itemHistory: ActivityHistory.fromJSON(json.itemHistory),
            openedStreamId: json.openedStreamId
                ? new Identifier<GitHubSearchStream>(json.openedStreamId)
                : undefined,
            openedSearchListId: json.openedSearchListId
                ? new Identifier<GitHubSearchList>(json.openedSearchListId)
                : undefined,
            openedItem: json.openedItem
                ? GitHubSearchResultItem.fromJSON(json.openedItem)
                : undefined,
            openedQuery: json.openedQuery ? GitHubSearchQuery.fromJSON(json.openedQuery) : undefined
        });
    }

    toJSON(): AppUserActivityJSON {
        return {
            itemHistory: this.itemHistory.toJSON(),
            openedStreamId: this.openedStreamId ? this.openedStreamId.toValue() : undefined,
            openedSearchListId: this.openedSearchListId
                ? this.openedSearchListId.toValue()
                : undefined,
            openedItem: this.openedItem ? this.openedItem.toJSON() : undefined,
            openedQuery: this.openedQuery ? this.openedQuery.toJSON() : undefined
        };
    }
}
