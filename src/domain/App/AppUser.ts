// MIT © 2017 azu

import { AppUserActivity, AppUserActivityJSON } from "./AppUserActivity";
import { GitHubSearchStream } from "../GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchList } from "../GitHubSearchList/GitHubSearchList";
import { GitHubUser } from "../GitHubUser/GitHubUser";
import { GitHubUserActivityEvent } from "../GitHubUser/GitHubUserActivityEvent";
import { UnionQuery } from "../GitHubSearchList/queries/QueryRole";
import { GitHubActiveItem } from "./Activity/GitHubActiveItem";

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

    openGitHubUser(gitHubUser: GitHubUser) {
        this.activity.activateGitHubUser(gitHubUser);
    }

    openSearchListSelf(searchList: GitHubSearchList) {
        this.activity.activateSearchList(searchList);
    }

    openQuery(searchList: GitHubSearchList, query: UnionQuery) {
        this.activity.activateQuery(searchList, query);
    }

    // child
    openGitHubUserEvent(event: GitHubUserActivityEvent) {
        this.activity.activateGitHubUserActivityEvent(event);
    }

    openItem(item: GitHubActiveItem): void {
        this.activity.activateItem(item);
    }

    seeNotificationAtTime(timeStamp: number) {
        this.activity.seeNotificationAtTime(timeStamp);
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
