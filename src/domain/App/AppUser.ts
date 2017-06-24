// MIT © 2017 azu

import { AppUserActivity, AppUserActivityJSON } from "./AppUserActivity";
import { GitHubSearchStream } from "../GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { GitHubSearchQuery } from "../GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchList } from "../GitHubSearch/GitHubSearchList/GitHubSearchList";

export interface AppUserJSON {
    activity: AppUserActivityJSON;
}

export interface AppUserArgs {
    activity: AppUserActivity;
}

export class AppUser {
    activity: AppUserActivity;

    constructor(args: AppUserArgs) {
        this.activity = args.activity;
    }

    openStream(stream: GitHubSearchStream): void {
        this.activity.activateStream(stream);
    }

    openItem(item: GitHubSearchResultItem): void {
        this.activity.activateItem(item);
    }

    openSearchListSelf(searchList: GitHubSearchList) {
        this.activity.activateSearchList(searchList);
    }

    openQuery(searchList: GitHubSearchList, query: GitHubSearchQuery) {
        this.activity.activateQuery(searchList, query);
    }

    static fromJSON(json: AppUserJSON): AppUser {
        const proto = Object.create(AppUser.prototype);
        return Object.assign(proto, {
            activity: AppUserActivity.fromJSON(json.activity)
        });
    }

    toJSON(): AppUserJSON {
        return {
            activity: this.activity.toJSON()
        };
    }
}
