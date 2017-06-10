// MIT © 2017 azu
import { Store } from "almin";
import { GitHubSearchStream } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { AppRepository } from "../../infra/repository/AppRepository";
import { AppUserActivity } from "../../domain/App/AppUserActivity";
import { NoticeRepository } from "../../infra/repository/NoticeRepository";

export interface NoticeStateArgs {}

export class NoticeState implements NoticeStateArgs {
    constructor(args: NoticeStateArgs) {}

    update(activity: AppUserActivity) {
        return new NoticeState({
            ...this as NoticeState,
            activeStream: activity.activeStream,
            activeItem: activity.activeItem
        });
    }
}

export class NoticeStore extends Store<NoticeState> {
    state: NoticeState;

    constructor(public noticeRepository: NoticeRepository) {
        super();
        this.state = new NoticeState({});
    }

    receivePayload() {
        const appRepository = this.noticeRepository.findAllByType(NoticeType);
        const newState = this.state.update(appRepository.user.activity);
        this.setState(newState);
    }

    getState(): NoticeState {
        return this.state;
    }
}
