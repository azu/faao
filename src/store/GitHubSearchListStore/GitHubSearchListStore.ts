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
    queries: GitHubSearchQuery[];
    editingQuery: GitHubSearchQuery | undefined;
    isOpenAddingPanel: boolean;
}

export class GitHubSearchListState implements GitHubSearchListStateObject {
    editingQuery: GitHubSearchQuery | undefined;
    isOpenAddingPanel: boolean;
    queries: GitHubSearchQuery[];

    constructor(state: GitHubSearchListStateObject) {
        this.queries = state.queries;
        this.isOpenAddingPanel = state.isOpenAddingPanel;
        this.editingQuery = state.editingQuery;
    }

    update(searchList: GitHubSearchList) {
        return new GitHubSearchListState({
            ...this as GitHubSearchListState,
            queries: searchList.queries
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
            queries: []
        });
    }

    receivePayload(payload: Payload) {
        const gitHubSearchList = this.gitHubSearchRepository.get();
        this.setState(this.state.update(gitHubSearchList).reduce(payload));
    }

    getState() {
        return this.state;
    }
}