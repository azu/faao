// MIT © 2017 azu

import { StoreMap } from "almin/lib/UILayer/StoreGroupTypes";
import { ProfileStore } from "./ProfileStore/ProfileStore";
import { StoreGroup } from "almin";
// FIXME: TypeScript compiler if the state interface was not imported
import { appRepository } from "../infra/repository/AppRepository";
import { gitHubSearchListRepository } from "../infra/repository/GitHubSearchListRepository";
import { gitHubSearchStreamRepository } from "../infra/repository/GitHubSearchStreamRepository";
import { GitHubSearchListStore } from "./GitHubSearchListStore/GitHubSearchListStore";
import { GitHubSearchStreamStore } from "./GitHubSearchStreamStore/GitHubSearchStreamStore";
import { AppStore } from "./AppStore/AppStore";
import { QuickIssueStore } from "./QuickIssueStore/QuickIssueStore";
import { gitHubSettingRepository } from "../infra/repository/GitHubSettingsRepository";
import { GitHubSettingStore } from "./GitHubSettingStore/GitHubSettingStore";
import { NoticeStore } from "./Notice/NoticeStore";
import { noticeRepository } from "../infra/repository/NoticeRepository";
import { storageManger } from "../infra/repository/Storage";

export const createStoreMap = () => {
    return {
        app: new AppStore(appRepository),
        gitHubSearchList: new GitHubSearchListStore(gitHubSearchListRepository),
        gitHubSearchStream: new GitHubSearchStreamStore(appRepository),
        quickIssue: new QuickIssueStore({
            appRepository,
            gitHubSearchListRepository,
            gitHubSettingRepository
        }),
        gitHubSetting: new GitHubSettingStore(gitHubSettingRepository),
        notice: new NoticeStore(noticeRepository),
        profile: new ProfileStore()
    };
};

export const createAppStoreGroup = <T>(storeMap: StoreMap<T>) => {
    return new StoreGroup(storeMap);
};
// singleton state/store
export const storeMapping = createStoreMap();
export const appStoreGroup = createAppStoreGroup(storeMapping);
export type AppStoreGroupState = typeof appStoreGroup.state;
/**
 * inject debuggable information to global
 */
export const debuggable = () => {
    // FIXME: disable webpack:///./~/glamor/lib/sheet.js log
    console.clear();
    // debug
    if (typeof global === "object") {
        (<any>global).faao = {
            repositories: {
                appRepository,
                gitHubSettingRepository,
                gitHubSearchListRepository,
                gitHubSearchStreamRepository,
                noticeRepository
            },
            storeMapping,
            get state() {
                return appStoreGroup.getState();
            },
            async debugOn() {
                await storageManger.useMemoryDriver();
                console.log("use memory driver for storage");
            },
            async debugOff() {
                return storageManger.resetDriver();
            }
        };
    }
};
