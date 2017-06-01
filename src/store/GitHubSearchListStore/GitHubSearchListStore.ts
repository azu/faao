// MIT © 2017 azu
import { Store } from "almin";
import { GitHubSearchListRepository } from "../../infra/repository/GitHubSearchListRepository";
import { GitHubSearchList } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchList";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";

export interface GitHubSearchListStateObject {
    queries: GitHubSearchQuery[];
}

export class GitHubSearchListState {
    queries: GitHubSearchQuery[];

    constructor(state: GitHubSearchListStateObject) {
        this.queries = state.queries;
    }

    update(searchList: GitHubSearchList) {
        return new GitHubSearchListState({
            ...this as GitHubSearchListState,
            queries: searchList.queries
        });
    }
}

export class GitHubSearchListStore extends Store<GitHubSearchListState> {
    state: GitHubSearchListState;
    gitHubSearchRepository: GitHubSearchListRepository;

    constructor(gitHubSearchRepository: GitHubSearchListRepository) {
        super();
        this.gitHubSearchRepository = gitHubSearchRepository;
        this.state = new GitHubSearchListState({
            queries: []
        });
    }

    receivePayload() {
        const gitHubSearchList = this.gitHubSearchRepository.get();
        this.setState(this.state.update(gitHubSearchList));
    }

    getState() {
        return this.state;
    }
}