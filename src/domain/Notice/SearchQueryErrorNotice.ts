// MIT © 2017 az
import { AbstractNotice } from "./Notice";
import { GitHubSearchQuery } from "../GitHubSearch/GitHubSearchList/GitHubSearchQuery";

export function isSearchQueryErrorNotice(notice: AbstractNotice): notice is SearchQueryErrorNotice {
    return notice.type === "SearchQueryErrorNotice";
}

export interface SearchQueryErrorNoticeArgs {
    query: GitHubSearchQuery;
    error: Error;
}

export class SearchQueryErrorNotice extends AbstractNotice {
    error: Error;
    query: GitHubSearchQuery;
    type = "SearchQueryErrorNotice";

    constructor(args: SearchQueryErrorNoticeArgs) {
        super();
        this.query = args.query;
        this.error = args.error;
    }
}
