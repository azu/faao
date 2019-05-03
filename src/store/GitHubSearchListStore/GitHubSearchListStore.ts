// MIT © 2017 azu
import { Payload, Store } from "almin";
import { GitHubSearchListRepository } from "../../infra/repository/GitHubSearchListRepository";
import { GitHubSearchList, UnionQuery } from "../../domain/GitHubSearchList/GitHubSearchList";
import {
    CloseQueryPanelUseCasePayload,
    EditQueryPanelUseCasePayload,
    OpenQueryPanelUseCasePayload
} from "../../use-case/GitHubSearchList/ToggleQueryPanelUseCase";
import {
    CloseSearchListPanelUseCasePayload,
    EditSearchListPanelUseCasePayload,
    OpenSearchListPanelUseCasePayload
} from "../../use-case/GitHubSearchList/ToggleSearchListPanelUseCase";
import { shallowEqual } from "shallow-equal-object";
import { FaaoSearchQuery } from "../../domain/GitHubSearchList/FaaoSearchQuery";

export type QueryPanelType = "github" | "faao";

export interface GitHubSearchListStateObject {
    searchLists: GitHubSearchList[];
    editingSearchList: GitHubSearchList | undefined;
    editingQuery: UnionQuery | undefined;
    openQueryPanelState: false | QueryPanelType;
    isSearchListPanelOpened: boolean;
    faaoQueries: FaaoSearchQuery[];
}

export class GitHubSearchListState implements GitHubSearchListStateObject {
    isSearchListPanelOpened: boolean;
    openQueryPanelState: false | QueryPanelType;
    editingSearchList: GitHubSearchList | undefined;
    editingQuery: UnionQuery | undefined;
    searchLists: GitHubSearchList[];
    faaoQueries: FaaoSearchQuery[];

    constructor(state: GitHubSearchListStateObject) {
        this.searchLists = state.searchLists;
        this.openQueryPanelState = state.openQueryPanelState;
        this.isSearchListPanelOpened = state.isSearchListPanelOpened;
        this.editingSearchList = state.editingSearchList;
        this.editingQuery = state.editingQuery;
        this.faaoQueries = state.faaoQueries;
    }

    update({
        faaoQueries,
        gitHubSearchLists
    }: {
        faaoQueries: FaaoSearchQuery[];
        gitHubSearchLists: GitHubSearchList[];
    }) {
        if (shallowEqual(this.searchLists, gitHubSearchLists)) {
            return this;
        }
        return new GitHubSearchListState({
            ...(this as GitHubSearchListState),
            searchLists: gitHubSearchLists,
            faaoQueries: faaoQueries
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
                openQueryPanelState: payload.panelType,
                editingSearchList: payload.searchList
            });
        }
        if (payload instanceof EditQueryPanelUseCasePayload) {
            return new GitHubSearchListState({
                ...(this as GitHubSearchListState),
                openQueryPanelState: payload.panelType,
                editingQuery: payload.query
            });
        }
        if (payload instanceof CloseQueryPanelUseCasePayload) {
            return new GitHubSearchListState({
                ...(this as GitHubSearchListState),
                openQueryPanelState: false,
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
            openQueryPanelState: false,
            editingSearchList: undefined,
            editingQuery: undefined,
            searchLists: [],
            faaoQueries: []
        });
    }

    receivePayload(payload: Payload) {
        // sort by name
        const gitHubSearchLists = this.gitHubSearchRepository.findAllSortBy(
            searchList => searchList.name
        );
        const faaoQueries = this.gitHubSearchRepository.findAllFaaoQuery();
        this.setState(
            this.state
                .update({
                    gitHubSearchLists,
                    faaoQueries
                })
                .reduce(payload)
        );
    }

    getState() {
        return this.state;
    }
}
