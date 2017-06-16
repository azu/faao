// MIT © 2017 azu
import { Payload, Store } from "almin";
import { GitHubSearchListRepository } from "../../infra/repository/GitHubSearchListRepository";
import { GitHubSearchList } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchList";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import {
    CloseQueryPanelUseCasePayload,
    EditQueryPanelUseCasePayload,
    OpenQueryPanelUseCasePayload
} from "../../use-case/GitHubSearchList/ToggleQueryPanelUseCase";

export interface GitHubSearchListStateObject {
    searchLists: GitHubSearchList[];
    editingSearchList: GitHubSearchList | undefined;
    editingQuery: GitHubSearchQuery | undefined;
    isOpenAddingPanel: boolean;
}

export class GitHubSearchListState implements GitHubSearchListStateObject {
    isOpenAddingPanel: boolean;
    editingSearchList: GitHubSearchList | undefined;
    editingQuery: GitHubSearchQuery | undefined;
    searchLists: GitHubSearchList[];

    constructor(state: GitHubSearchListStateObject) {
        this.searchLists = state.searchLists;
        this.isOpenAddingPanel = state.isOpenAddingPanel;
        this.editingSearchList = state.editingSearchList;
        this.editingQuery = state.editingQuery;
    }

    update(gitHubSearchLists: GitHubSearchList[]) {
        return new GitHubSearchListState({
            ...this as GitHubSearchListState,
            searchLists: gitHubSearchLists
        });
    }

    reduce(
        payload:
            | OpenQueryPanelUseCasePayload
            | CloseQueryPanelUseCasePayload
            | EditQueryPanelUseCasePayload
    ) {
        if (payload instanceof OpenQueryPanelUseCasePayload) {
            return new GitHubSearchListState({
                ...this as GitHubSearchListState,
                isOpenAddingPanel: true,
                editingSearchList: payload.searchList
            });
        } else if (payload instanceof EditQueryPanelUseCasePayload) {
            return new GitHubSearchListState({
                ...this as GitHubSearchListState,
                isOpenAddingPanel: true,
                editingQuery: payload.query
            });
        } else if (payload instanceof CloseQueryPanelUseCasePayload) {
            return new GitHubSearchListState({
                ...this as GitHubSearchListState,
                isOpenAddingPanel: false,
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
            isOpenAddingPanel: false,
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
