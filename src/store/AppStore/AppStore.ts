// MIT © 2017 azu
import { Store } from "almin";
import { GitHubSearchStream } from "../../domain/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../../domain/GitHubSearchStream/GitHubSearchResultItem";
import { AppRepository } from "../../infra/repository/AppRepository";
import { GitHubSearchQuery } from "../../domain/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchList } from "../../domain/GitHubSearchList/GitHubSearchList";
import { GitHubSearchListRepository } from "../../infra/repository/GitHubSearchListRepository";
import { GitHubSearchStreamRepository } from "../../infra/repository/GitHubSearchStreamRepository";

export interface AppStateArgs {
    activeStream?: GitHubSearchStream;
    activeItem?: GitHubSearchResultItem;
    activeQuery?: GitHubSearchQuery;
    activeSearchList?: GitHubSearchList;
}

export class AppState implements AppStateArgs {
    activeStream?: GitHubSearchStream;
    activeItem?: GitHubSearchResultItem;
    activeQuery?: GitHubSearchQuery;
    activeSearchList?: GitHubSearchList;

    constructor(args: AppStateArgs) {
        this.activeItem = args.activeItem;
        this.activeStream = args.activeStream;
        this.activeQuery = args.activeQuery;
        this.activeSearchList = args.activeSearchList;
    }

    update({ activeStream, activeItem, activeQuery, activeSearchList }: AppStateArgs) {
        return new AppState({
            ...this as AppState,
            activeStream: activeStream,
            activeItem: activeItem,
            activeQuery: activeQuery,
            activeSearchList: activeSearchList
        });
    }
}

export interface AppStoreArgs {
    appRepository: AppRepository;
    gitHubSearchListRepository: GitHubSearchListRepository;
    gitHubSearchStreamRepository: GitHubSearchStreamRepository;
}

export class AppStore extends Store<AppState> {
    state: AppState;

    constructor(private args: AppStoreArgs) {
        super();
        this.state = new AppState({});
    }

    receivePayload() {
        const appRepository = this.args.appRepository.get();
        const {
            openedQuery,
            openedItem,
            openedSearchListId,
            openedStreamId
        } = appRepository.user.activity;
        const activeSearchList = this.args.gitHubSearchListRepository.findById(openedSearchListId);
        const activeStream = this.args.gitHubSearchStreamRepository.findById(openedStreamId);
        const newState = this.state.update({
            activeItem: openedItem,
            activeQuery: openedQuery,
            activeSearchList,
            activeStream
        });
        this.setState(newState);
    }

    getState(): AppState {
        return this.state;
    }
}
