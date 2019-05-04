// MIT © 2017 az
import { AbstractNotice } from "./Notice";
import { UnionQuery } from "../GitHubSearchList/GitHubSearchList";
import { GitHubSearchResultItem } from "../GitHubSearchStream/GitHubSearchResultItem";

export interface SearchQueryErrorNoticeArgs {
    title: string;
    subTitle?: string;
    body: string;
    icon?: string;
    silent?: boolean;
    refs: {
        query: UnionQuery;
        item: GitHubSearchResultItem;
    };
}

export function isOSNotice(notice: AbstractNotice): notice is OSNotice {
    return notice.type === "OSNotice";
}

// Based on https://electronjs.org/docs/api/notification
export class OSNotice extends AbstractNotice {
    type = "OSNotice";
    title: string;
    subTitle?: string;
    body: string;
    icon?: string;
    silent?: boolean;
    // TODO: it can be GC?
    refs: {
        query: UnionQuery;
        item: GitHubSearchResultItem;
    };

    constructor(args: SearchQueryErrorNoticeArgs) {
        super();
        this.title = args.title;
        this.subTitle = args.subTitle;
        this.body = args.body;
        this.icon = args.icon;
        this.silent = args.silent;
        this.refs = args.refs;
    }
}
