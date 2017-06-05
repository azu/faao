// MIT © 2017 azu
"use strict";
import { StoreGroup, StoreGroupTypes } from "almin";
// FIXME: TypeScript compiler if the state interface was not imported
import { appRepository } from "../infra/repository/AppRepository";
import { gitHubSearchListRepository } from "../infra/repository/GitHubSearchListRepository";
import { gitHubSearchStreamRepository } from "../infra/repository/GitHubSearchStreamRepository";
import { GitHubSearchListStore, GitHubSearchListState } from "./GitHubSearchListStore/GitHubSearchListStore";
import { GitHubSearchStreamStore, GitHubSearchStreamState } from "./GitHubSearchStream/GitHubSearchStream";
import { AppStore, AppState } from "./AppStore/AppStore";
import { QuickIssueStore, QuickIssueState } from "./QuickIssueStore/QuickIssueStore";
import { gitHubSettingRepository } from "../infra/repository/GitHubSettingsRepository";
import { GitHubSettingStore, GitHubSettingState } from "./GitHubSettingStore/GitHubSettingStore";
// repository
// store
// store mapping
export const storeMapping = {
    app: new AppStore(appRepository),
    gitHubSearchList: new GitHubSearchListStore(gitHubSearchListRepository),
    gitHubSearchStream: new GitHubSearchStreamStore(gitHubSearchStreamRepository),
    quickIssue: new QuickIssueStore({
        appRepository,
        gitHubSearchListRepository,
        gitHubSettingRepository
    }),
    gitHubSetting: new GitHubSettingStore(gitHubSettingRepository)
};

// debug
(<any>window).faao = {
    repositories: {
        appRepository,
        gitHubSettingRepository,
        gitHubSearchListRepository,
        gitHubSearchStreamRepository
    },
    stores: storeMapping
};
// state mapping
export const stateMapping = StoreGroupTypes.StoreToState(storeMapping);
export type AppStoreGroupState = typeof stateMapping;

export class AppStoreGroup {
    static create() {
        return new StoreGroup(storeMapping);
    }
}
