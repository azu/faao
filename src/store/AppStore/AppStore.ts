// MIT © 2017 azu
import { Store } from "almin";
import { GitHubSearchStream } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { AppRepository } from "../../infra/repository/AppRepository";
import { AppUserActivity } from "../../domain/App/AppUserActivity";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";

export interface AppStateArgs {
    activeStream?: GitHubSearchStream;
    activeItem?: GitHubSearchResultItem;
    activeQuery?: GitHubSearchQuery;
}

export class AppState implements AppStateArgs {
    activeStream?: GitHubSearchStream;
    activeItem?: GitHubSearchResultItem;
    activeQuery?: GitHubSearchQuery;

    constructor(args: AppStateArgs) {
        this.activeItem = args.activeItem;
        this.activeStream = args.activeStream;
        this.activeQuery = args.activeQuery;
    }

    update(activity: AppUserActivity) {
        return new AppState({
            ...this as AppState,
            activeStream: activity.activeStream,
            activeItem: activity.activeItem,
            activeQuery: activity.activeQuery instanceof GitHubSearchQuery
                ? activity.activeQuery
                : undefined
        });
    }
}

export class AppStore extends Store<AppState> {
    state: AppState;

    constructor(public appRepository: AppRepository) {
        super();
        this.state = new AppState({});
    }

    receivePayload() {
        const appRepository = this.appRepository.get();
        const newState = this.state.update(appRepository.user.activity);
        this.setState(newState);
    }

    getState(): AppState {
        return this.state;
    }
}
