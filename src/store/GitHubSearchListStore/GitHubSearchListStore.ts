// MIT © 2017 azu
import { Payload, Store } from "almin";
import { GitHubSearchListRepository } from "../../infra/repository/GitHubSearchListRepository";
import { GitHubSearchList } from "../../domain/GitHubSearchList/GitHubSearchList";
import { GitHubSearchQuery } from "../../domain/GitHubSearchList/GitHubSearchQuery";
import {
    CloseQueryPanelUseCasePayload, EditQueryPanelUseCasePayload,
    OpenQueryPanelUseCasePayload
} from "../../use-case/GitHubSearchList/ToggleQueryPanelUseCase";
import {
    CloseSearchListPanelUseCasePayload, EditSearchListPanelUseCasePayload,
    OpenSearchListPanelUseCasePayload
} from "../../use-case/GitHubSearchList/ToggleSearchListPanelUseCase";
import { shallowEqual } from "shallow-equal-object";

export interface GitHubSearchListStateObject {
    searchLists: GitHubSearchList[];
    editingSearchList: GitHubSearchList | undefined;
    editingQuery: GitHubSearchQuery | undefined;
    isQueryPanelOpened: boolean;
    isSearchListPanelOpened: boolean;
}

export class GitHubSearchListState implements GitHubSearchListStateObject {
    isSearchListPanelOpened: boolean;
    isQueryPanelOpened: boolean;
    editingSearchList: GitHubSearchList | undefined;
    editingQuery: GitHubSearchQuery | undefined;
    searchLists: GitHubSearchList[];

    constructor(state: GitHubSearchListStateObject) {
        this.searchLists = state.searchLists;
        this.isQueryPanelOpened = state.isQueryPanelOpened;
        this.isSearchListPanelOpened = state.isSearchListPanelOpened;
        this.editingSearchList = state.editingSearchList;
        this.editingQuery = state.editingQuery;
    }

    update(gitHubSearchLists: GitHubSearchList[]) {
        if (shallowEqual(this.searchLists, gitHubSearchLists)) {
            return this;
        }
        return new GitHubSearchListState({
            ...(this as GitHubSearchListState),
            searchLists: gitHubSearchLists
        });
    }

    reduce(
        payload:
            | OpenQueryPanelUseCasePayload
            | CloseQueryPanelUseCasePayload
            | EditQueryPanelUseCasePayload
            | OpenSearchListPanelUseCasePayload
            | CloseSearchListPanelUseCasePayload
            | EditSearchListPanelUseCasePayload
    ) {
        if (payload instanceof OpenSearchListPanelUseCasePayload) {
            return new GitHubSearchListState({
                ...(this as GitHubSearchListState),
                isSearchListPanelOpened: true
            });
        }
        if (payload instanceof CloseSearchListPanelUseCasePayload) {
            return new GitHubSearchListState({
                ...(this as GitHubSearchListState),
                isSearchListPanelOpened: false,
                editingSearchList: undefined
            });
        }
        if (payload instanceof EditSearchListPanelUseCasePayload) {
            return new GitHubSearchListState({
                ...(this as GitHubSearchListState),
                isSearchListPanelOpened: true,
                editingSearchList: payload.gitHubSearchList
            });
        }
        if (payload instanceof OpenQueryPanelUseCasePayload) {
            return new GitHubSearchListState({
                ...(this as GitHubSearchListState),
                isQueryPanelOpened: true,
                editingSearchList: payload.searchList
            });
        }
        if (payload instanceof EditQueryPanelUseCasePayload) {
            return new GitHubSearchListState({
                ...(this as GitHubSearchListState),
                isQueryPanelOpened: true,
                editingQuery: payload.query
            });
        }
        if (payload instanceof CloseQueryPanelUseCasePayload) {
            return new GitHubSearchListState({
                ...(this as GitHubSearchListState),
                isQueryPanelOpened: false,
                editingSearchList: undefined,
                editingQuery: undefined
            });
        }

        return this;
    }
}

export class GitHubSearchListStore extends Store<GitHubSearchListState> {
    state: GitHubSearchListState;
    gitHubSearchRepository: GitHubSearchListRepository;

    constructor(gitHubSearchListRepository: GitHubSearchListRepository) {
        super();
        this.gitHubSearchRepository = gitHubSearchListRepository;
        this.state = new GitHubSearchListState({
            isSearchListPanelOpened: false,
            isQueryPanelOpened: false,
            editingSearchList: undefined,
            editingQuery: undefined,
            searchLists: []
        });
    }

    receivePayload(payload: Payload) {
        // sort by name
        const gitHubSearchLists = this.gitHubSearchRepository.findAllSortBy(
            searchList => searchList.name
        );
        this.setState(this.state.update(gitHubSearchLists).reduce(payload));
    }

    getState() {
        return this.state;
    }
}
