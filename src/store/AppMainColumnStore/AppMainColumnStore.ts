// MIT © 2017 azu
import { Store } from "almin";
import { AppRepository } from "../../infra/repository/AppRepository";
import { OpenedContent } from "../../domain/App/AppUserActivity";
import { isOpenedGitHubStream } from "../../domain/App/Activity/OpenedGitHubStream";
import { isOpenedGitHubUser } from "../../domain/App/Activity/OpenedGitHubUser";

export enum AppMainColumnShowType {
    NONE,
    GitHubStream,
    GitHubUserActivity
}

export interface AppMainColumnStateArgs {
    showType: AppMainColumnShowType;
}

export class AppMainColumnState {
    showType: AppMainColumnShowType;

    constructor(args: AppMainColumnStateArgs) {
        this.showType = args.showType;
    }

    update(param: { openedContent?: OpenedContent }) {
        const openedContent = param.openedContent;
        if (!openedContent) {
            return new AppMainColumnState({
                ...(this as AppMainColumnStateArgs),
                showType: AppMainColumnShowType.NONE
            });
        } else if (isOpenedGitHubStream(openedContent)) {
            return new AppMainColumnState({
                ...(this as AppMainColumnStateArgs),
                showType: AppMainColumnShowType.GitHubStream
            });
        } else if (isOpenedGitHubUser(openedContent)) {
            return new AppMainColumnState({
                ...(this as AppMainColumnStateArgs),
                showType: AppMainColumnShowType.GitHubUserActivity
            });
        }
        return this;
    }
}

export interface AppMainColumnStoreArgs {
    appRepository: AppRepository;
}

export class AppMainColumnStore extends Store<AppMainColumnState> {
    state: AppMainColumnState;

    constructor(private args: AppMainColumnStoreArgs) {
        super();
        this.state = new AppMainColumnState({
            showType: AppMainColumnShowType.NONE
        });
    }

    receivePayload() {
        const app = this.args.appRepository.get();
        const openedContent = app.user.activity.openedContent;
        this.setState(this.state.update({ openedContent }));
    }

    getState() {
        return this.state;
    }
}
