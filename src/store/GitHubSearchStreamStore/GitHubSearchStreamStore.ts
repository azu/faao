// MIT © 2017 azu
import { Store } from "almin";
import { GitHubSearchStream } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { AppRepository } from "../../infra/repository/AppRepository";
import { GitHubSearchStreamStateItem } from "./GitHubSearchStreamStateItem";

export interface GitHubSearchStreamStateObject {
    items: GitHubSearchResultItem[];
    filterWord?: string;
    displayItems: GitHubSearchResultItem[];
}

export class GitHubSearchStreamState implements GitHubSearchStreamStateObject {
    items: GitHubSearchResultItem[];
    filterWord?: string;
    displayItems: GitHubSearchStreamStateItem[];

    constructor(state: GitHubSearchStreamStateObject) {
        this.items = state.items;
        this.displayItems = state.displayItems.map(item => new GitHubSearchStreamStateItem(item));
        this.filterWord = state.filterWord;
    }

    get hasResult(): boolean {
        return this.displayItems.length > 0;
    }

    update(stream?: GitHubSearchStream) {
        if (!stream) {
            return this;
        }
        return new GitHubSearchStreamState({
            ...this as GitHubSearchStreamState,
            items: stream.items,
            displayItems: stream.sortedItems,
            filterWord: stream.filterWord
        });
    }
}

export class GitHubSearchStreamStore extends Store<GitHubSearchStreamState> {
    state: GitHubSearchStreamState;

    constructor(public appRepository: AppRepository) {
        super();
        this.state = new GitHubSearchStreamState({
            items: [],
            filterWord: undefined,
            displayItems: []
        });
    }

    receivePayload() {
        const app = this.appRepository.get();
        const activeStream = app.user.activity.activeStream;
        this.setState(this.state.update(activeStream));
    }

    getState() {
        return this.state;
    }
}
