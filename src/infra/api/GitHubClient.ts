// MIT © 2017 azu
import { GitHubSearchQuery } from "../../domain/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchResult } from "../../domain/GitHubSearchStream/GitHubSearchResult";
import { GitHubSearchResultFactory } from "../../domain/GitHubSearchStream/GitHubSearchResultFactory";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";
import { GitHubSearchResultItemJSON } from "../../domain/GitHubSearchStream/GitHubSearchResultItem";
import { GitHubUserActivityEvent } from "../../domain/GitHubUser/GitHubUserActivityEvent";

const debug = require("debug")("faao:GitHubClient");
const Octokat = require("octokat");
// https://github.com/philschatz/octokat.js/issues/180
Octokat.Fetch = (...args: any[]) => {
    return (window as any).fetch(...args);
};
/**
 * The plugins we'll use with Octokat.
 *
 * Most notably, this doesn't include:
 *   - hypermedia // Not parse date
 *   - camelcase
 * Both take a _lot_ of time in post-processing and are unnecessary.
 */
const OctokatPlugins = [
    require("octokat/dist/node/plugins/object-chainer"),
    require("octokat/dist/node/plugins/path-validator"),
    require("octokat/dist/node/plugins/authorization"),
    require("octokat/dist/node/plugins/preview-apis"),
    require("octokat/dist/node/plugins/use-post-instead-of-patch"),

    require("octokat/dist/node/plugins/simple-verbs"),
    require("octokat/dist/node/plugins/fetch-all"),

    require("octokat/dist/node/plugins/read-binary"),
    require("octokat/dist/node/plugins/pagination")
];

export class GitHubClient {
    gh: any;

    constructor(gitHubSetting: GitHubSetting) {
        this.gh = new Octokat({
            token: gitHubSetting.token,
            rootURL: gitHubSetting.apiHost,
            plugins: OctokatPlugins
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
            items: GitHubSearchResultItemJSON[];
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

    events(
        onProgress: (searchResult: GitHubSearchResult) => Promise<boolean>,
        onError: (error: Error) => void,
        onComplete: () => void
    ) {
        type FetchResponse = {
            items: GitHubUserActivityEvent[];
            fetch: () => Promise<FetchResponse>;
            next_page_url?: string;
        };
        this.gh.fromUrl("/user").fetch().then((response: any) => {
            const login = response.login;
            const onFetch = (fetchResponse: any) => {
                debug("response %o", fetchResponse);
                const gitHubSearchResult = GitHubSearchResultFactory.create({
                    items: response.items || []
                });
                // Support incompleteResults
                onProgress(fetchResponse)
                    .then(isContinue => {
                        if (isContinue) {
                            // fetch next page if needed
                            if (fetchResponse.next_page_url) {
                                this.gh
                                    .fromUrl(fetchResponse.next_page_url)
                                    .fetch()
                                    .then(onFetch, onError);
                            } else {
                                onComplete();
                            }
                        } else {
                            onComplete();
                        }
                    })
                    .catch(onError);
            };
            return this.gh.fromUrl(`/users/${login}/events`).fetch().then(onFetch, onError);
        });
    }

    user() {
        return this.gh.fromUrl("/user").fetch();
    }

    rateLimits(): Promise<boolean> {
        return this.gh.fromUrl("/rate_limit").fetch().then((response: any) => {
            return response.rate.limit > 0;
        });
    }
}
