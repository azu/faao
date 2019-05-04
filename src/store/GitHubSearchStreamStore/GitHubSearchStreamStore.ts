// MIT © 2017 azu
import { Payload, Store } from "almin";
import { GitHubSearchStream } from "../../domain/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../../domain/GitHubSearchStream/GitHubSearchResultItem";
import { AppRepository } from "../../infra/repository/AppRepository";
import { GitHubSearchStreamStateItem } from "./GitHubSearchStreamStateItem";
import {
    LoadingFinishedPayload,
    LoadingStartedPayload
} from "../../use-case/GitHubSearchList/SearchQueryToUpdateStreamUseCase";
import { ActivityHistory } from "../../domain/App/ActivityHistory";
import { GitHubSearchStreamRepository } from "../../infra/repository/GitHubSearchStreamRepository";
import { LRUMapLike } from "lru-map-like";
import { isOpenedGitHubStream } from "../../domain/App/Activity/OpenedGitHubStream";

const debug = require("debug")("faao:GitHubSearchStreamStore");
const stateItemCacheMap = new LRUMapLike<GitHubSearchResultItem, GitHubSearchStreamStateItem>(1000);

export interface GitHubSearchStreamStateArgs {
    isLoading: boolean;
    items: GitHubSearchResultItem[];
    rawItemCount: number;
    filterWord?: string;
    displayItems: GitHubSearchStreamStateItem[];
}

export class GitHubSearchStreamState implements GitHubSearchStreamStateArgs {
    itemCount: number;
    rawItemCount: number;
    isLoading: boolean;
    items: GitHubSearchResultItem[];
    filterWord?: string;
    displayItems: GitHubSearchStreamStateItem[];

    constructor(args: GitHubSearchStreamStateArgs | GitHubSearchStreamState) {
        this.isLoading = args.isLoading;
        this.items = args.items;
        this.itemCount = this.items.length;
        this.rawItemCount = args.rawItemCount;
        this.displayItems = args.displayItems;
        this.filterWord = args.filterWord;
    }

    get hasResult(): boolean {
        return this.rawItemCount > 0;
    }

    update({
        stream,
        itemHistory
    }: {
        stream?: GitHubSearchStream;
        itemHistory: ActivityHistory<GitHubSearchResultItem>;
    }) {
        if (!stream) {
            debug("stream is not found in store");
            return new GitHubSearchStreamState({
                ...(this as GitHubSearchStreamStateArgs),
                items: [],
                displayItems: [],
                rawItemCount: 0
            });
        }
        return new GitHubSearchStreamState({
            ...(this as GitHubSearchStreamState),
            items: stream.items,
            rawItemCount: stream.itemSortedCollection.rawItemCount,
            displayItems: stream.items.map(item => {
                if (stateItemCacheMap.has(item)) {
                    const cachedItem = stateItemCacheMap.get(item)!;
                    cachedItem.setRead(itemHistory.isRead(item.id, item.updatedAtDate));
                    return cachedItem;
                }
                const gitHubSearchStreamStateItem = new GitHubSearchStreamStateItem(
                    item,
                    itemHistory.isRead(item.id, item.updatedAtDate)
                );
                stateItemCacheMap.set(item, gitHubSearchStreamStateItem);
                return gitHubSearchStreamStateItem;
            }),
            filterWord: stream.filterWord
        });
    }

    reduce(payload: LoadingStartedPayload | LoadingFinishedPayload) {
        if (payload instanceof LoadingStartedPayload) {
            return new GitHubSearchStreamState({
                ...(this as GitHubSearchStreamState),
                isLoading: true
            });
        } else if (payload instanceof LoadingFinishedPayload) {
            return new GitHubSearchStreamState({
                ...(this as GitHubSearchStreamState),
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
            rawItemCount: 0,
            filterWord: undefined,
            displayItems: []
        });
    }

    receivePayload(payload: Payload) {
        const app = this.args.appRepository.get();
        const openedContent = app.user.activity.openedContent;
        const activeStreamId = isOpenedGitHubStream(openedContent)
            ? openedContent.gitHubSearchStreamId
            : undefined;
        const activeStream = this.args.gitHubSearchStreamRepository.findById(activeStreamId);
        this.setState(
            this.state
                .update({
                    stream: activeStream,
                    itemHistory: app.user.activity.streamItemHistory
                })
                .reduce(payload)
        );
    }

    getState() {
        return this.state;
    }
}
