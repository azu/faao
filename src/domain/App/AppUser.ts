// MIT © 2017 azu

import { AppUserActivity } from "./AppUserActivity";
import { GitHubSearchStream } from "../GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { GitHubSearchQuery } from "../GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchList } from "../GitHubSearch/GitHubSearchList/GitHubSearchList";

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
}
