// MIT © 2017 azu
import { Store } from "almin";
import { NoticeRepository } from "../../infra/repository/NoticeRepository";
import { isSearchQueryErrorNotice, SearchQueryErrorNotice } from "../../domain/Notice/SearchQueryErrorNotice";

export interface NoticeStateArgs {
    searchQueryErrorNotices: SearchQueryErrorNotice[];
}

export class NoticeState implements NoticeStateArgs {
    searchQueryErrorNotices: SearchQueryErrorNotice[];

    constructor(args: NoticeStateArgs) {
        this.searchQueryErrorNotices = args.searchQueryErrorNotices;
    }

    get searchQueryErrorNotice() {
        if (this.searchQueryErrorNotices.length === 0) {
            return undefined;
        }
        return this.searchQueryErrorNotices[0];
    }

    get hasNotice(): boolean {
        return this.searchQueryErrorNotices.length > 0;
    }

    update(args: NoticeStateArgs) {
        return new NoticeState({
            ...this as NoticeState,
            searchQueryErrorNotices: args.searchQueryErrorNotices
        });
    }
}

export class NoticeStore extends Store<NoticeState> {
    state: NoticeState;

    constructor(public noticeRepository: NoticeRepository) {
        super();
        this.state = new NoticeState({
            searchQueryErrorNotices: []
        });
    }

    receivePayload() {
        const searchQueryErrorNotices = this.noticeRepository.findAllByType(isSearchQueryErrorNotice);
        const newState = this.state.update({
            searchQueryErrorNotices: searchQueryErrorNotices
        });
        this.setState(newState);
    }

    getState(): NoticeState {
        return this.state;
    }
}
