// MIT © 2017 azu
"use strict";
import { StoreGroup, StoreGroupTypes } from "almin";
// FIXME: TypeScript compiler if the state interface was not imported
import { GitHubSearchListStore, GitHubSearchListState } from "./GitHubSearchListStore/GitHubSearchListStore";
import gitHubSearchListRepository from "../infra/repository/GitHubSearchListRepository";
import gitHubSearchStreamRepository from "../infra/repository/GitHubSearchStreamRepository";
import { GitHubSearchStreamStore, GitHubSearchStreamState } from "./GitHubSearchStream/GitHubSearchStream";
// repository
// store

// store mapping
export const storeMapping = {
    gitHubSearchList: new GitHubSearchListStore(gitHubSearchListRepository),
    gitHubSearchStream: new GitHubSearchStreamStore(gitHubSearchStreamRepository),
};
// state mapping
export const stateMapping = StoreGroupTypes.StoreToState(storeMapping);
export type AppStoreGroupState = typeof stateMapping;

export class AppStoreGroup {
    static create() {
        return new StoreGroup(storeMapping);
    }
}