// MIT © 2017 azu
import { Store } from "almin";
import { GitHubSearchStream } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { GitHubSearchStreamRepository } from "../../infra/repository/GitHubSearchStreamRepository";

export interface GitHubSearchStreamStateObject {
    items: GitHubSearchResultItem[];
}

export class GitHubSearchStreamState {
    items: GitHubSearchResultItem[];

    constructor(state: GitHubSearchStreamStateObject) {
        this.items = state.items;
    }

    update(stream: GitHubSearchStream) {
        return new GitHubSearchStreamState({
            ...this as GitHubSearchStreamState,
            items: stream.items
        });
    }
}

export class GitHubSearchStreamStore extends Store<GitHubSearchStreamState> {
    state: GitHubSearchStreamState;
    gitHubSearchStreamRepository: GitHubSearchStreamRepository;

    constructor(gitHubSearchStreamRepository: GitHubSearchStreamRepository) {
        super();
        this.gitHubSearchStreamRepository = gitHubSearchStreamRepository;
        this.state = new GitHubSearchStreamState({
            items: []
        });
    }

    receivePayload() {
        const stream = this.gitHubSearchStreamRepository.get();
        this.setState(this.state.update(stream));
    }

    getState() {
        return this.state;
    }
}