// MIT © 2017 azu
import { Payload, Store } from "almin";
import { GitHubSearchListRepository } from "../../infra/repository/GitHubSearchListRepository";
import { GitHubSearchList } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchList";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import {
    CloseQueryPanelUseCasePayload,
    OpenQueryPanelUseCasePayload
} from "../../use-case/GitHubSearchList/ToggleQueryPanelUseCase";

export interface GitHubSearchListStateObject {
    searchLists: GitHubSearchList[];
    editingQuery: GitHubSearchQuery | undefined;
    isOpenAddingPanel: boolean;
}

export class GitHubSearchListState implements GitHubSearchListStateObject {
    isOpenAddingPanel: boolean;
    editingQuery: GitHubSearchQuery | undefined;
    searchLists: GitHubSearchList[];

    constructor(state: GitHubSearchListStateObject) {
        this.searchLists = state.searchLists;
        this.isOpenAddingPanel = state.isOpenAddingPanel;
        this.editingQuery = state.editingQuery;
    }

    get queries() {
        if (this.searchLists.length === 0) {
            return [];
        }
        return this.searchLists[0].queries;
    }

    get editingQueryIndex() {
        if (!this.editingQuery) {
            return -1;
        }
        return this.queries.indexOf(this.editingQuery);
    }

    update(gitHubSearchLists: GitHubSearchList[]) {
        return new GitHubSearchListState({
            ...this as GitHubSearchListState,
            searchLists: gitHubSearchLists
        });
    }

    reduce(payload: OpenQueryPanelUseCasePayload | CloseQueryPanelUseCasePayload) {
        if (payload instanceof OpenQueryPanelUseCasePayload) {
            return new GitHubSearchListState({
                ...this as GitHubSearchListState,
                isOpenAddingPanel: true,
                editingQuery: payload.query
            });
        } else if (payload instanceof CloseQueryPanelUseCasePayload) {
            return new GitHubSearchListState({
                ...this as GitHubSearchListState,
                isOpenAddingPanel: false,
                editingQuery: undefined
            });
        }
        return this;
    }
}

export class GitHubSearchListStore extends Store<GitHubSearchListState> {
    state: GitHubSearchListState;
    gitHubSearchRepository: GitHubSearchListRepository;

    constructor(gitHubSearchRepository: GitHubSearchListRepository) {
        super();
        this.gitHubSearchRepository = gitHubSearchRepository;
        this.state = new GitHubSearchListState({
            isOpenAddingPanel: false,
            editingQuery: undefined,
            searchLists: []
        });
    }

    receivePayload(payload: Payload) {
        const gitHubSearchLists = this.gitHubSearchRepository.findAll();
        this.setState(this.state.update(gitHubSearchLists).reduce(payload));
    }

    getState() {
        return this.state;
    }
}
