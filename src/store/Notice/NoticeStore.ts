// MIT © 2017 azu
import { Store } from "almin";
import { NoticeRepository } from "../../infra/repository/NoticeRepository";
import {
    isSearchQueryErrorNotice,
    SearchQueryErrorNotice
} from "../../domain/Notice/SearchQueryErrorNotice";
import { GenericErrorNotice, isGenericErrorNotice } from "../../domain/Notice/GenericErrorNotice";
import { shallowEqual } from "shallow-equal-object";
import { isOSNotice, OSNotice } from "../../domain/Notice/OSNotice";

export interface NoticeStateArgs {
    searchQueryErrorNotices: SearchQueryErrorNotice[];
    genericErrorNotices: GenericErrorNotice[];
    osNotices: OSNotice[];
}

export class NoticeState implements NoticeStateArgs {
    searchQueryErrorNotices: SearchQueryErrorNotice[];
    genericErrorNotices: GenericErrorNotice[];
    osNotices: OSNotice[];

    constructor(args: NoticeStateArgs | NoticeState) {
        this.searchQueryErrorNotices = args.searchQueryErrorNotices;
        this.genericErrorNotices = args.genericErrorNotices;
        this.osNotices = args.osNotices;
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
            shallowEqual(this.searchQueryErrorNotices, args.searchQueryErrorNotices) &&
            shallowEqual(this.osNotices, args.osNotices)
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
            genericErrorNotices: [],
            osNotices: []
        });
    }

    receivePayload() {
        const genericErrorNotices = this.noticeRepository.findAllByType(isGenericErrorNotice);
        const osNotices = this.noticeRepository.findAllByType(isOSNotice);
        const searchQueryErrorNotices = this.noticeRepository.findAllByType(
            isSearchQueryErrorNotice
        );
        const newState = this.state.update({
            searchQueryErrorNotices,
            genericErrorNotices,
            osNotices
        });
        this.setState(newState);
    }

    getState(): NoticeState {
        return this.state;
    }
}
