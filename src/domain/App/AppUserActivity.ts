// MIT © 2017 azu
import { GitHubSearchStream } from "../GitHubSearchStream/GitHubSearchStream";
import {
    GitHubSearchResultItem,
    GitHubSearchResultItemJSON
} from "../GitHubSearchStream/GitHubSearchResultItem";
import { GitHubSearchQuery, GitHubSearchQueryJSON } from "../GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchList } from "../GitHubSearchList/GitHubSearchList";
import { ActivityHistory, ActivityHistoryItem, ActivityHistoryJSON } from "./ActivityHistory";
import { Identifier } from "../Entity";
import { GitHubUser } from "../GitHubUser/GitHubUser";

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
    openedUserId?: string;
    // value object
    openedItem?: GitHubSearchResultItemJSON;
    openedQuery?: GitHubSearchQueryJSON;
}

export class AppUserActivity {
    itemHistory: ActivityHistory;
    openedStreamId?: Identifier<GitHubSearchStream>;
    openedSearchListId?: Identifier<GitHubSearchList>;
    openedUserId?: Identifier<GitHubUser>;
    // value object
    openedItem?: GitHubSearchResultItem;
    openedQuery?: GitHubSearchQuery;

    constructor(args: AppUserActivityArgs) {
        this.itemHistory = args.itemHistory;
    }

    /**
     * active search is SearchList mode or SearchQuery mode.
     */
    get activeSearch():
        | Identifier<GitHubUser>
        | Identifier<GitHubSearchList>
        | GitHubSearchQuery
        | undefined {
        if (this.openedSearchListId && !this.openedQuery) {
            return this.openedSearchListId;
        } else if (this.openedQuery) {
            return this.openedQuery;
        } else if (this.openedUserId) {
            return this.openedUserId;
        }
        return;
    }

    activateStream(stream: GitHubSearchStream) {
        this.openedStreamId = stream.id;
    }

    activateItem(item: GitHubSearchResultItem) {
        this.openedItem = item;
        this.itemHistory.readItem(
            new ActivityHistoryItem({
                id: item.id,
                timeStamp: Date.now()
            })
        );
    }

    private clearCurrentOpened() {
        this.openedUserId = undefined;
        this.openedSearchListId = undefined;
        this.openedStreamId = undefined;
        this.openedItem = undefined;
        this.openedQuery = undefined;
    }

    activateGitHubUser(gitHubUser: GitHubUser) {
        this.clearCurrentOpened();
        this.openedUserId = gitHubUser.id;
    }

    activateSearchList(searchList: GitHubSearchList) {
        this.clearCurrentOpened();
        this.openedSearchListId = searchList.id;
    }

    activateQuery(searchList: GitHubSearchList, query: GitHubSearchQuery) {
        this.clearCurrentOpened();
        this.openedSearchListId = searchList.id;
        this.openedQuery = query;
        this.openedUserId = undefined;
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
