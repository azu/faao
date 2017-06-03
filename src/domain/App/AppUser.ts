// MIT © 2017 azu

import { AppUserActivity } from "./AppUserActivity";
import { GitHubSearchStream } from "../GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";

export interface AppUserArgs {
    activity: AppUserActivity;
}

export class AppUser {
    activity: AppUserActivity;

    constructor(args: AppUserArgs) {
        this.activity = args.activity;
    }

    openStream(stream: GitHubSearchStream): void {
        this.activity.addStream(stream);
    }

    openItem(item: GitHubSearchResultItem): void {
        this.activity.addItem(item);
    }
}