// MIT © 2017 azu
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchResult } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResult";
import { GitHubSearchResultFactory } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultFactory";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";
import { Item } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";

const debug = require("debug")("faao:GitHubClient");
const Octokat = require("octokat");

if (!process.env.GH_TOKEN) {
    throw new Error("process.env.GH_TOKEN should be set GitHub Personal token");
}

export class GitHubClient {
    gh: any;

    constructor(gitHubSetting: GitHubSetting) {
        this.gh = new Octokat({
            token: gitHubSetting.token,
            rootURL: gitHubSetting.apiHost,
            disableHypermedia: true // Not parse date
        });
    }

    /**
     * @param query
     * @param onProgress call with response when fetch each results
     * @param onError call with error when occur error
     * @param onComplete call when complete fetch
     */
    search(
        query: GitHubSearchQuery,
        onProgress: (searchResult: GitHubSearchResult) => Promise<boolean>,
        onError: (error: Error) => void,
        onComplete: () => void
    ): void {
        type FetchResponse = {
            items: Item[];
            incompleteResults: boolean;
            fetch: () => Promise<FetchResponse>;
        };
        const onFetch = (response: FetchResponse) => {
            debug("response %o", response);
            // Support incompleteResults
            const gitHubSearchResult = GitHubSearchResultFactory.create({
                items: response.items || []
            });
            onProgress(gitHubSearchResult)
                .then(isContinue => {
                    if (!response.incompleteResults) {
                        onComplete();
                    } else if (isContinue) {
                        response.fetch().then(onFetch);
                    } else {
                        onComplete();
                    }
                })
                .catch(onError);
        };
        this.gh.search.issues
            .fetch({
                q: query.query,
                sort: "updated", // always updated
                per_page: 100
            })
            .then(onFetch, onError);
    }
}
