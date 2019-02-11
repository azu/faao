// MIT © 2017 azu
import { Store } from "almin";
import { NoticeRepository } from "../../infra/repository/NoticeRepository";
import {
    isSearchQueryErrorNotice,
    SearchQueryErrorNotice
} from "../../domain/Notice/SearchQueryErrorNotice";
import { GenericErrorNotice, isGenericErrorNotice } from "../../domain/Notice/GenericErrorNotice";
import { shallowEqual } from "shallow-equal-object";

export interface NoticeStateArgs {
    searchQueryErrorNotices: SearchQueryErrorNotice[];
    genericErrorNotices: GenericErrorNotice[];
}

export class NoticeState implements NoticeStateArgs {
    searchQueryErrorNotices: SearchQueryErrorNotice[];
    genericErrorNotices: GenericErrorNotice[];

    constructor(args: NoticeStateArgs | NoticeState) {
        this.searchQueryErrorNotices = args.searchQueryErrorNotices;
        this.genericErrorNotices = args.genericErrorNotices;
    }

    /**
     * return important error notice
     */
    get errorNotice() {
        if (this.searchQueryErrorNotices.length !== 0) {
            return this.searchQueryErrorNotices[0];
        } else if (this.genericErrorNotices.length !== 0) {
            return this.genericErrorNotices[0];
        }
        return;
    }

    get hasNotice(): boolean {
        return this.errorNotice !== undefined;
    }

    update(args: NoticeStateArgs) {
        if (
            shallowEqual(this.genericErrorNotices, args.genericErrorNotices) &&
            shallowEqual(this.searchQueryErrorNotices, args.searchQueryErrorNotices)
        ) {
            return this;
        }

        return new NoticeState({
            ...(this as NoticeState),
            ...args
        });
    }
}

export class NoticeStore extends Store<NoticeState> {
    state: NoticeState;

    constructor(public noticeRepository: NoticeRepository) {
        super();
        this.state = new NoticeState({
            searchQueryErrorNotices: [],
            genericErrorNotices: []
        });
    }

    receivePayload() {
        const genericErrorNotices = this.noticeRepository.findAllByType(isGenericErrorNotice);
        const searchQueryErrorNotices = this.noticeRepository.findAllByType(
            isSearchQueryErrorNotice
        );
        const newState = this.state.update({
            searchQueryErrorNotices,
            genericErrorNotices
        });
        this.setState(newState);
    }

    getState(): NoticeState {
        return this.state;
    }
}
