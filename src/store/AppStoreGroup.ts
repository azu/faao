// MIT © 2017 azu
("use strict");
import { StoreGroup, StoreGroupTypes } from "almin";
// FIXME: TypeScript compiler if the state interface was not imported
import { appRepository } from "../infra/repository/AppRepository";
import { gitHubSearchListRepository } from "../infra/repository/GitHubSearchListRepository";
import { gitHubSearchStreamRepository } from "../infra/repository/GitHubSearchStreamRepository";
import {
    GitHubSearchListStore,
    GitHubSearchListState
} from "./GitHubSearchListStore/GitHubSearchListStore";
import {
    GitHubSearchStreamStore,
    GitHubSearchStreamState
} from "./GitHubSearchStreamStore/GitHubSearchStreamStore";
import { AppStore, AppState } from "./AppStore/AppStore";
import { QuickIssueStore, QuickIssueState } from "./QuickIssueStore/QuickIssueStore";
import { gitHubSettingRepository } from "../infra/repository/GitHubSettingsRepository";
import { GitHubSettingStore, GitHubSettingState } from "./GitHubSettingStore/GitHubSettingStore";
import { NoticeStore, NoticeState } from "./Notice/NoticeStore";
import { noticeRepository } from "../infra/repository/NoticeRepository";
import { storageManger } from "../infra/repository/Storage";

// repository
// store
// store mapping
export const storeMapping = {
    app: new AppStore(appRepository),
    gitHubSearchList: new GitHubSearchListStore(gitHubSearchListRepository),
    gitHubSearchStream: new GitHubSearchStreamStore(appRepository),
    quickIssue: new QuickIssueStore({
        appRepository,
        gitHubSearchListRepository,
        gitHubSettingRepository
    }),
    gitHubSetting: new GitHubSettingStore(gitHubSettingRepository),
    notice: new NoticeStore(noticeRepository)
};

// debug
(<any>window).faao = {
    repositories: {
        appRepository,
        gitHubSettingRepository,
        gitHubSearchListRepository,
        gitHubSearchStreamRepository,
        noticeRepository
    },
    stores: storeMapping,
    async debugOn() {
        await storageManger.useMemoryDriver();
        console.log("use memory driver for storage");
    },
    async debugOff() {
        return storageManger.resetDriver();
    }
};
// state mapping
export const stateMapping = StoreGroupTypes.StoreToState(storeMapping);
export type AppStoreGroupState = typeof stateMapping;

export class AppStoreGroup {
    static create() {
        return new StoreGroup(storeMapping);
    }
}
