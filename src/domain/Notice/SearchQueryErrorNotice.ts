// MIT © 2017 az
import { AbstractNotice } from "./Notice";
import { UnionQuery } from "../GitHubSearchList/GitHubSearchList";

export function isSearchQueryErrorNotice(notice: AbstractNotice): notice is SearchQueryErrorNotice {
    return notice.type === "SearchQueryErrorNotice";
}

export interface SearchQueryErrorNoticeArgs {
    query: UnionQuery;
    error: Error;
}

export class SearchQueryErrorNotice extends AbstractNotice {
    error: Error;
    query: UnionQuery;
    type = "SearchQueryErrorNotice";

    constructor(args: SearchQueryErrorNoticeArgs) {
        super();
        this.query = args.query;
        this.error = args.error;
    }
}
