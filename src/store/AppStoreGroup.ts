// MIT © 2017 azu

import { StoreGroup, StoreGroupTypes } from "almin";
import { ProfileStore } from "./ProfileStore/ProfileStore";
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
import { MobileStore } from "./Mobile/MobileStore";
import { gitHubUserRepository } from "../infra/repository/GitHubUserRepository";
import { GitHubUserStore } from "./GitHubUserStore/GitHubUserStore";
import { AppMainColumnStore } from "./AppMainColumnStore/AppMainColumnStore";

export const createStoreMap = () => {
    return {
        app: new AppStore({
            appRepository,
            gitHubSearchListRepository,
            gitHubSearchStreamRepository
        }),
        appMainColumn: new AppMainColumnStore({
            appRepository
        }),
        gitHubSearchList: new GitHubSearchListStore(gitHubSearchListRepository),
        gitHubSearchStream: new GitHubSearchStreamStore({
            appRepository,
            gitHubSearchStreamRepository
        }),
        quickIssue: new QuickIssueStore({
            appRepository,
            gitHubSearchListRepository,
            gitHubSearchStreamRepository,
            gitHubSettingRepository
        }),
        gitHubSetting: new GitHubSettingStore({
            gitHubUserRepository,
            gitHubSettingRepository
        }),
        gitHubUser: new GitHubUserStore({
            appRepository,
            gitHubUserRepository
        }),
        notice: new NoticeStore(noticeRepository),
        profile: new ProfileStore(),
        mobile: new MobileStore()
    };
};

export const createAppStoreGroup = <T>(storeMap: StoreGroupTypes.StoreMap<T>) => {
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
        (global as any).faao = {
            repositories: {
                appRepository,
                gitHubSettingRepository,
                gitHubSearchListRepository,
                gitHubSearchStreamRepository,
                gitHubUserRepository,
                noticeRepository
            },
            storeMapping,
            get state() {
                return appStoreGroup.getState();
            },
            async debugOn() {
                await storageManger.useMemoryDriver();
                console.info("use memory driver for storage");
            },
            async debugOff() {
                return storageManger.resetDriver();
            }
        };
    }
};
