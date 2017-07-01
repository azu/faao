// MIT © 2017 azu
import { GitHubSearchStream } from "../GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../GitHubSearchStream/GitHubSearchResultItem";
import { GitHubSearchQuery } from "../GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchList } from "../GitHubSearchList/GitHubSearchList";
import { ActivityHistory, ActivityHistoryItem, ActivityHistoryJSON } from "./ActivityHistory";
import { Identifier } from "../Entity";
import { GitHubUser } from "../GitHubUser/GitHubUser";
import {
    isOpenedGitHubUser,
    OpenedGitHubUser,
    OpenedGitHubUserJSON
} from "./Activity/OpenedGitHubUser";
import {
    isOpenedGitHubSearchList,
    OpenedGitHubSearchList,
    OpenedGitHubSearchListJSON
} from "./Activity/OpenedGitHubSearchList";
import {
    isOpenedGitHubStream,
    OpenedGitHubStream,
    OpenedGitHubStreamJSON
} from "./Activity/OpenedGitHubStream";
import { GitHubUserActivityEvent } from "../GitHubUser/GitHubUserActivityEvent";

// menu
type OpenedMenu = OpenedGitHubSearchList;
type OpenedMenuJSON = OpenedGitHubSearchListJSON;
// open either one of these as content
type OpenedContent = OpenedGitHubStream | OpenedGitHubUser;
type OpenedContentJSON = OpenedGitHubStreamJSON | OpenedGitHubUserJSON;

/**
 * Note: Entity should not reference to other entity instance.
 * Insteadof it, should reference by id.(soft link)
 * http://domain-driven-design.3010926.n2.nabble.com/Can-an-Entity-be-Shared-across-many-Aggregates-td7579277.html
 * https://softwareengineering.stackexchange.com/questions/328571/ddd-is-it-correct-for-a-root-aggregate-to-hold-a-reference-to-another-root-aggr
 */
export interface AppUserActivityJSON {
    streamItemHistory: ActivityHistoryJSON;
    openedMenu?: OpenedMenuJSON;
    openedContent?: OpenedContentJSON;
}

export interface AppUserActivityArgs {
    streamItemHistory: ActivityHistory<GitHubSearchResultItem>;
    openedMenu?: OpenedMenu;
    openedContent?: OpenedContent;
}

export class AppUserActivity {
    streamItemHistory: ActivityHistory<GitHubSearchResultItem>;
    openedMenu?: OpenedGitHubSearchList;
    openedContent?: OpenedContent;

    constructor(args: AppUserActivityArgs) {
        this.streamItemHistory = args.streamItemHistory;
        this.openedMenu = args.openedMenu;
        this.openedContent = args.openedContent;
    }

    /**
     * active search is SearchList mode or SearchQuery mode.
     */
    get activeSearch():
        | Identifier<GitHubUser>
        | Identifier<GitHubSearchList>
        | GitHubSearchQuery
        | undefined {
        return;
    }

    // getter
    // menu
    get openedSearchListId(): Identifier<GitHubSearchList> | undefined {
        return isOpenedGitHubSearchList(this.openedMenu)
            ? this.openedMenu.gitHubSearchListId
            : undefined;
    }

    get openedQuery(): GitHubSearchQuery | undefined {
        return isOpenedGitHubSearchList(this.openedMenu) ? this.openedMenu.query : undefined;
    }

    // content
    get openedStreamId(): Identifier<GitHubSearchStream> | undefined {
        return isOpenedGitHubStream(this.openedContent)
            ? this.openedContent.gitHubSearchStreamId
            : undefined;
    }

    get openedUserId(): Identifier<GitHubUser> | undefined {
        return isOpenedGitHubUser(this.openedContent) ? this.openedContent.gitHubUserId : undefined;
    }

    get openedItem(): GitHubSearchResultItem | undefined {
        return isOpenedGitHubStream(this.openedContent) ? this.openedContent.item : undefined;
    }

    activateStream(stream: GitHubSearchStream) {
        this.openedContent = new OpenedGitHubStream({
            gitHubSearchStreamId: stream.id
        });
    }

    activateItem(item: GitHubSearchResultItem) {
        if (isOpenedGitHubStream(this.openedContent)) {
            this.openedContent = this.openedContent.openItem(item);
        }
        this.streamItemHistory.readItem(
            new ActivityHistoryItem({
                id: item.id,
                timeStamp: Date.now()
            })
        );
    }

    activateSearchList(searchList: GitHubSearchList) {
        this.openedMenu = new OpenedGitHubSearchList({
            gitHubSearchListId: searchList.id
        });
    }

    activateQuery(searchList: GitHubSearchList, query: GitHubSearchQuery) {
        this.openedMenu = new OpenedGitHubSearchList({
            gitHubSearchListId: searchList.id,
            query
        });
    }

    activateGitHubUser(gitHubUser: GitHubUser) {
        this.openedContent = new OpenedGitHubUser({
            gitHubUserId: gitHubUser.id
        });
    }

    activateGitHubUserActivityEvent(event: GitHubUserActivityEvent) {
        if (isOpenedGitHubUser(this.openedContent)) {
            this.openedContent = this.openedContent.openEvent(event);
        }
    }

    static fromJSON(json: AppUserActivityJSON): AppUserActivity {
        const openedContent = ((openedActivity?: OpenedContentJSON) => {
            if (!openedActivity) {
                return;
            }
            switch (openedActivity.type) {
                case "OpenedGitHubUser":
                    return OpenedGitHubUser.fromJSON(openedActivity);
                case "OpenedGitHubStream":
                    return OpenedGitHubStream.fromJSON(openedActivity);
            }
        })(json.openedContent);

        const openedMenu = (openedMenu => {
            if (!openedMenu) {
                return;
            }
            switch (openedMenu.type) {
                case "OpenedGitHubSearchList":
                    return OpenedGitHubSearchList.fromJSON(openedMenu);
            }
        })(json.openedMenu);
        return new AppUserActivity({
            streamItemHistory: ActivityHistory.fromJSON(json.streamItemHistory),
            openedMenu,
            openedContent
        });
    }

    toJSON(): AppUserActivityJSON {
        return {
            streamItemHistory: this.streamItemHistory.toJSON(),
            openedMenu: this.openedMenu ? this.openedMenu.toJSON() : undefined,
            openedContent: this.openedContent ? this.openedContent.toJSON() : undefined
        };
    }
}
