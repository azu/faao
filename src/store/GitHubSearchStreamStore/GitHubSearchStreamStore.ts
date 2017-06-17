// MIT © 2017 azu
import { Payload, Store } from "almin";
import { GitHubSearchStream } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { AppRepository } from "../../infra/repository/AppRepository";
import { GitHubSearchStreamStateItem } from "./GitHubSearchStreamStateItem";
import {
    LoadingFinishedPayload,
    LoadingStartedPayload
} from "../../use-case/GitHubSearchList/SearchQueryToUpdateStreamUseCase";

export interface GitHubSearchStreamStateObject {
    isLoading: boolean;
    items: GitHubSearchResultItem[];
    filterWord?: string;
    displayItems: GitHubSearchResultItem[];
}

export class GitHubSearchStreamState implements GitHubSearchStreamStateObject {
    isLoading: boolean;
    items: GitHubSearchResultItem[];
    filterWord?: string;
    displayItems: GitHubSearchStreamStateItem[];

    constructor(state: GitHubSearchStreamStateObject) {
        this.isLoading = state.isLoading;
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

    reduce(payload: LoadingStartedPayload | LoadingFinishedPayload) {
        if (payload instanceof LoadingStartedPayload) {
            return new GitHubSearchStreamState({
                ...this as GitHubSearchStreamState,
                isLoading: true
            });
        } else if (payload instanceof LoadingFinishedPayload) {
            return new GitHubSearchStreamState({
                ...this as GitHubSearchStreamState,
                isLoading: false
            });
        }
        return this;
    }
}

export class GitHubSearchStreamStore extends Store<GitHubSearchStreamState> {
    state: GitHubSearchStreamState;

    constructor(public appRepository: AppRepository) {
        super();
        this.state = new GitHubSearchStreamState({
            isLoading: false,
            items: [],
            filterWord: undefined,
            displayItems: []
        });
    }

    receivePayload(payload: Payload) {
        const app = this.appRepository.get();
        const activeStream = app.user.activity.activeStream;
        this.setState(this.state.update(activeStream).reduce(payload));
    }

    getState() {
        return this.state;
    }
}
