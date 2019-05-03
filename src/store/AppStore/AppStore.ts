// MIT © 2017 azu
import { Store } from "almin";
import { GitHubSearchStream } from "../../domain/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../../domain/GitHubSearchStream/GitHubSearchResultItem";
import { AppRepository } from "../../infra/repository/AppRepository";
import { GitHubSearchList, UnionQuery } from "../../domain/GitHubSearchList/GitHubSearchList";
import { GitHubSearchListRepository } from "../../infra/repository/GitHubSearchListRepository";
import { GitHubSearchStreamRepository } from "../../infra/repository/GitHubSearchStreamRepository";

export interface AppStateArgs {
    activeStream?: GitHubSearchStream;
    activeItem?: GitHubSearchResultItem;
    activeQuery?: UnionQuery;
    activeSearchList?: GitHubSearchList;
}

export class AppState implements AppStateArgs {
    activeStream?: GitHubSearchStream;
    activeItem?: GitHubSearchResultItem;
    activeQuery?: UnionQuery;
    activeSearchList?: GitHubSearchList;

    constructor(args: AppStateArgs) {
        this.activeItem = args.activeItem;
        this.activeStream = args.activeStream;
        this.activeQuery = args.activeQuery;
        this.activeSearchList = args.activeSearchList;
    }

    update({ activeStream, activeItem, activeQuery, activeSearchList }: AppStateArgs) {
        return new AppState({
            ...(this as AppState),
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
        const activity = appRepository.user.activity;
        const activeSearchList = activity.openedSearchListId
            ? this.args.gitHubSearchListRepository.findById(activity.openedSearchListId)
            : undefined;
        const activeStream = activity.openedStreamId
            ? this.args.gitHubSearchStreamRepository.findById(activity.openedStreamId)
            : undefined;
        const activeQuery = activity.openedQuery ? activity.openedQuery : undefined;
        const activeItem = activity.openedItem ? activity.openedItem : undefined;
        const newState = this.state.update({
            activeItem,
            activeQuery,
            activeSearchList,
            activeStream
        });
        this.setState(newState);
    }

    getState(): AppState {
        return this.state;
    }
}
