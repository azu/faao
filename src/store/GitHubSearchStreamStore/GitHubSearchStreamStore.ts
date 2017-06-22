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
import { ActivityHistory } from "../../domain/App/ActivityHistory";
import { GitHubSearchStreamRepository } from "../../infra/repository/GitHubSearchStreamRepository";

export interface GitHubSearchStreamStateObject {
    isLoading: boolean;
    items: GitHubSearchResultItem[];
    filterWord?: string;
    displayItems: GitHubSearchStreamStateItem[];
}

export class GitHubSearchStreamState implements GitHubSearchStreamStateObject {
    isLoading: boolean;
    items: GitHubSearchResultItem[];
    filterWord?: string;
    displayItems: GitHubSearchStreamStateItem[];

    constructor(state: GitHubSearchStreamStateObject) {
        this.isLoading = state.isLoading;
        this.items = state.items;
        this.displayItems = state.displayItems;
        this.filterWord = state.filterWord;
    }

    get hasResult(): boolean {
        return this.displayItems.length > 0;
    }

    update({ stream, itemHistory }: { stream?: GitHubSearchStream; itemHistory: ActivityHistory }) {
        if (!stream) {
            return this;
        }
        return new GitHubSearchStreamState({
            ...this as GitHubSearchStreamState,
            items: stream.items,
            displayItems: stream.sortedItems.map(item => {
                return new GitHubSearchStreamStateItem(item, itemHistory.isRead(item));
            }),
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

export interface GitHubSearchStreamStoreArgs {
    appRepository: AppRepository;
    gitHubSearchStreamRepository: GitHubSearchStreamRepository;
}

export class GitHubSearchStreamStore extends Store<GitHubSearchStreamState> {
    state: GitHubSearchStreamState;

    constructor(private args: GitHubSearchStreamStoreArgs) {
        super();
        this.state = new GitHubSearchStreamState({
            isLoading: false,
            items: [],
            filterWord: undefined,
            displayItems: []
        });
    }

    receivePayload(payload: Payload) {
        const app = this.args.appRepository.get();
        const activeStreamId = app.user.activity.activeStreamId;
        if (!activeStreamId) {
            return this.setState(this.state.reduce(payload));
        }
        const activeStream = this.args.gitHubSearchStreamRepository.findById(activeStreamId);
        this.setState(
            this.state
                .update({
                    stream: activeStream,
                    itemHistory: app.user.activity.itemHistory
                })
                .reduce(payload)
        );
    }

    getState() {
        return this.state;
    }
}
