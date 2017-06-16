// MIT © 2017 azu
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchResult } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResult";
import { GitHubSearchResultFactory } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultFactory";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";
import { Item } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { EventEmitter } from "events";

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
    require("octokat/dist/node/plugins/pagination"),
    require("octokat/dist/node/plugins/camel-case")
];

export class GitHubClient {
    gh: any;
    emitter: EventEmitter;

    constructor(gitHubSetting: GitHubSetting) {
        const emitter = (...args: any[]) => {
            console.log(args);
        };
        this.gh = new Octokat({
            token: gitHubSetting.token,
            rootURL: gitHubSetting.apiHost,
            plugins: OctokatPlugins,
            emitter: emitter
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

    user() {
        return this.gh.fromUrl("/user").fetch().then((response: any) => {
            console.log(response);
        });
    }

    rateLimits() {
        return this.gh.fromUrl("/rate_limit").fetch().then((...response: any[]) => {
            console.log(response);
        });
    }
}
