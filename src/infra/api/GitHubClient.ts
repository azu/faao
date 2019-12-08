// MIT © 2017 azu
import {
    GitHubSearchQuery,
    isGitHubSearchQuery
} from "../../domain/GitHubSearchList/queries/GitHubSearchQuery";
import { GitHubSearchResult } from "../../domain/GitHubSearchStream/GitHubSearchResult";
import { GitHubSearchResultFactory } from "../../domain/GitHubSearchStream/GitHubSearchResultFactory";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";
import { GitHubSearchResultItemJSON } from "../../domain/GitHubSearchStream/GitHubSearchResultItem";
import {
    GitHubUserActivityEvent,
    GitHubUserActivityEventJSON
} from "../../domain/GitHubUser/GitHubUserActivityEvent";
import { GitHubUserProfile } from "../../domain/GitHubUser/GitHubUserProfile";
import { GitHubUserActivityEventFactory } from "../../domain/GitHubUser/GitHubUserActivityEventFactory";
import {
    FaaoSearchQuery,
    isFaaoSearchQuery
} from "../../domain/GitHubSearchList/queries/FaaoSearchQuery";
import { GraphQLClient } from "graphql-request";

import urlJoin from "url-join";
import { QueryRole } from "../../domain/GitHubSearchList/queries/QueryRole";
import {
    GitHubNotificationQuery,
    isGitHubNotificationQuery
} from "../../domain/GitHubSearchList/queries/GitHubNotificationQuery";

import Octokit from "@octokit/rest";
import { GitHubReceivedEventsForUserQuery } from "../../domain/GitHubSearchList/queries/GitHubReceivedEventsForUserQuery";
import { GitHubETag } from "../../domain/GitHubSearchList/queries/GitHubETag";

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
    private gh: any;
    private graphQLClient: GraphQLClient;
    private octokit: Octokit;

    constructor(gitHubSetting: GitHubSetting) {
        this.gh = new Octokat({
            token: gitHubSetting.token,
            rootURL: gitHubSetting.apiHost,
            plugins: OctokatPlugins
        });
        this.graphQLClient = new GraphQLClient(urlJoin(gitHubSetting.apiHost, "/graphql"), {
            headers: {
                authorization: `Bearer ${gitHubSetting.token}`
            }
        });
        this.octokit = new Octokit({
            auth: gitHubSetting.token,
            baseUrl: gitHubSetting.apiHost,
            userAgent: "faao<https://github.com/azu/faao>"
        });
    }

    /**
     * @param query
     * @param onProgress call with response when fetch each results
     * onProgress handler should return Promise<boolean>
     * if return true, continue to fetch
     * @param onError call with error when occur error
     * @param onComplete call when complete fetch
     */
    search(
        query: QueryRole,
        onProgress: (searchResult: GitHubSearchResult) => Promise<boolean>,
        onError: (error: Error) => void,
        onComplete: () => void
    ): void {
        if (isGitHubNotificationQuery(query)) {
            this.searchGitHubNotification(query, onProgress, onError, onComplete);
        } else if (isFaaoSearchQuery(query)) {
            this.searchFaaoQuery(query, onProgress, onError, onComplete);
        } else if (isGitHubSearchQuery(query)) {
            this.searchSearchQuery(query, onProgress, onError, onComplete);
        }
    }

    private searchSearchQuery(
        query: GitHubSearchQuery,
        onProgress: (searchResult: GitHubSearchResult) => Promise<boolean>,
        onError: (error: Error) => void,
        onComplete: () => void
    ) {
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

    private searchFaaoQuery(
        query: FaaoSearchQuery,
        onProgress: (searchResult: GitHubSearchResult) => Promise<boolean>,
        onError: (error: Error) => void,
        onComplete: () => void
    ) {
        type QueryResponse = {
            title: string;
            repository: {
                url: string;
            };
            comments: {
                totalCount: number;
                nodes: {
                    url: string;
                }[];
            };
            id: string;
            number: number;
            author: {
                login: string;
                avatarUrl: string;
                url: string;
            };
            state: "OPEN" | "CLOSED" | "MERGED";
            locked: boolean;
            labels: {
                nodes: {
                    name: string;
                    description: string;
                    color: string;
                    isDefault: boolean;
                    url: string;
                }[];
            };
            assignees: {
                nodes: {
                    avatarUrl: string;

                    login: string;
                    id: string;
                    url: string;
                }[];
            };
            milestone: {
                title: string;
                description: string;
                url: string;
                createdAt: string;
                updatedAt: string;
                dueOn?: string | null;
                closedAt: string | null;
                state: "OPEN" | "CLOSED";
            };
            createdAt: string;
            updatedAt: string;
            closedAt: string;
            url: string;
            body: string;
        };
        const queries = query.searchParams.params
            .map(param => {
                const parsed = param.parsed();
                if (!parsed) {
                    return undefined;
                }
                return `
  ${parsed.type}${parsed.no}: repository(owner: "${parsed.user}", name: "${parsed.repo}") {
    ${parsed.type === "issue" ? "issue" : "pullRequest"}(number: ${parsed.no}) {
      title
      repository {
        url
      }
      comments(last:1){
        totalCount
        nodes{
          url
        }
      }
      id
      number
      author {
        login
        avatarUrl
        url
      }
      state
      locked
      labels(first: 10){
        nodes{
          name
          description
          color
          isDefault
          url
        }
      }
      assignees(first: 10) {
        nodes {
          avatarUrl
          login
          id
          url
        }
      }
      milestone {
        title
        description
        url
        createdAt
        updatedAt
        dueOn
        closedAt
        state
      }
      createdAt
      updatedAt
      closedAt
      url
      body
    }
  }
`;
            })
            .filter(query => query !== undefined);
        const graphQLQuery = `{
${queries.join("\n")}
}`;
        const convertState = (
            state: "OPEN" | "CLOSED" | "MERGED"
        ): "open" | "closed" | "merged" => {
            switch (state) {
                case "OPEN":
                    return "open";
                case "CLOSED":
                    return "closed";
                case "MERGED":
                    return "merged";
                default:
                    return state;
            }
        };
        const convertQueryResponseToGitHubSearchResult = (
            type: "pr" | "issue",
            response: QueryResponse
        ): GitHubSearchResultItemJSON => {
            return {
                type,
                assignees: response.assignees.nodes.map(node => {
                    return {
                        login: node.login,
                        avatar_url: node.avatarUrl,
                        html_url: node.url
                    };
                }),
                body: response.body,
                closed_at: response.closedAt,
                comments: response.comments.totalCount,
                created_at: response.createdAt,
                html_url: response.url,
                id: response.id,
                labels: response.labels.nodes.map(node => {
                    return {
                        color: node.color,
                        default: node.isDefault,
                        name: node.name,
                        url: node.url
                    };
                }),
                locked: response.locked,
                milestone: response.milestone
                    ? {
                          html_url: response.milestone.url,
                          title: response.milestone.title,
                          description: response.milestone.description,
                          created_at: response.milestone.createdAt,
                          updated_at: response.milestone.updatedAt,
                          closed_at: response.milestone.closedAt,
                          due_on: response.milestone.dueOn,
                          state: convertState(response.milestone.state)
                      }
                    : null,
                number: response.number,
                state: convertState(response.state),
                title: response.title,
                updated_at: response.updatedAt,
                user: {
                    avatar_url: response.author.avatarUrl,
                    html_url: response.author.url,
                    login: response.author.login
                }
            };
        };
        const requestPromise = query.hasRequestableSearchParams
            ? this.graphQLClient.request(graphQLQuery)
            : Promise.resolve({});
        requestPromise
            .then(data => {
                const items = Object.keys(data).map(key => {
                    const dataType = /^issue/.test(key) ? "issue" : "pullRequest";
                    const queryResponse = (data as any)[key][dataType] as QueryResponse;
                    const typeKey = dataType === "issue" ? "issue" : "pr";
                    return convertQueryResponseToGitHubSearchResult(typeKey, queryResponse);
                });
                const gitHubSearchResult = GitHubSearchResultFactory.create({
                    items: items || []
                });
                onProgress(gitHubSearchResult).then((_continue: boolean) => {
                    // TODO: handle onProgress resolve value
                    onComplete();
                });
            })
            .catch(onError);
    }

    events(
        onProgress: (events: GitHubUserActivityEvent[]) => Promise<boolean>,
        onError: (error: Error) => void,
        onComplete: () => void
    ) {
        type FetchResponse = {
            items: GitHubUserActivityEventJSON[];
            fetch: () => Promise<FetchResponse>;
            next_page_url?: string;
        };
        this.gh
            .fromUrl("/user")
            .fetch()
            .then((response: any) => {
                const login = response.login;
                const onFetch = (fetchResponse: FetchResponse) => {
                    debug("response %o", fetchResponse);
                    const items = fetchResponse.items.map(item => {
                        return GitHubUserActivityEventFactory.create(item);
                    });
                    onProgress(items)
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
                return this.gh
                    .fromUrl(`/users/${login}/events`)
                    .fetch()
                    .then(onFetch, onError);
            });
    }

    userProfile(): Promise<GitHubUserProfile> {
        return this.gh
            .fromUrl("/user")
            .fetch()
            .then((response: any) => {
                return new GitHubUserProfile({
                    loginName: response.login,
                    avatarURL: response.avatar_url
                });
            });
    }

    rateLimits(): Promise<boolean> {
        return this.gh
            .fromUrl("/rate_limit")
            .fetch()
            .then((response: any) => {
                return response.rate.limit > 0;
            });
    }

    private searchGitHubNotification(
        query: GitHubNotificationQuery,
        onProgress: (searchResult: GitHubSearchResult) => Promise<boolean>,
        onError: (error: Error) => void,
        onComplete: () => void
    ) {
        const normalizeResponseAPIURL = (url: string): string => {
            return url.replace(
                /^https:\/\/api\.github\.com\/repos\/(.*?)\/(commits|pulls|issues)\/(.*?)/,
                function(_all, repo, type, number) {
                    return (
                        "https://github.com/" +
                        repo +
                        "/" +
                        type.replace("pulls", "pull") +
                        "/" +
                        number
                    );
                }
            );
        };

        this.octokit.activity
            .listNotifications({
                since: query.sinceDate.toISODate()
            })
            .then(function(response) {
                debug("GET /notifications:", response);
                return response.data;
            })
            .then(function(responses) {
                const items = responses.map(response => {
                    const commentIdPattern = /^https:.+\/comments\/(\d+)$/;
                    const commentId = commentIdPattern.test(response.subject.latest_comment_url)
                        ? response.subject.latest_comment_url.replace(commentIdPattern, "$1")
                        : undefined;
                    const commentHash = commentId ? `#issuecomment-${commentId}` : "";
                    return {
                        id: response.id,
                        title: response.subject.title,
                        html_url: normalizeResponseAPIURL(response.subject.url) + commentHash,
                        type: response.subject.type as any,
                        user: {
                            html_url: response.repository.html_url,
                            login: response.repository.owner.login,
                            avatar_url: response.repository.owner.avatar_url
                        },
                        labels: [],
                        number: 0,
                        state: "open" as any,
                        milestone: null,
                        closed_at: null,
                        assignees: [],
                        body: null,
                        comments: 0,
                        locked: false,
                        created_at: response.updated_at,
                        updated_at: response.updated_at
                    };
                });
                const result = GitHubSearchResultFactory.create({
                    items
                });
                onProgress(result).then(() => {
                    onComplete();
                });
            })
            .catch(onError);
    }

    /**
     * Search receive events
     * @param query
     * @param onError
     * @param onComplete
     */
    searchGitHubEventsForUser(
        query: GitHubReceivedEventsForUserQuery,
        onError: (error: Error) => void,
        onComplete: ({
            events,
            eTag
        }: {
            events: GitHubUserActivityEvent[];
            eTag: GitHubETag;
        }) => void
    ) {
        this.octokit.activity
            .listReceivedEventsForUser({
                headers: query.eTag.valid()
                    ? {
                          "If-None-Match": query.eTag.valueOf()
                      }
                    : {},
                username: query.query.userName
            })
            .then(response => {
                return {
                    response: response.data,
                    eTag: response.headers.etag
                };
            })
            .then(function({ response, eTag }: { response: any; eTag: string }) {
                const events = response.events.map((item: any) => {
                    return GitHubUserActivityEventFactory.create(item);
                });
                onComplete({
                    events,
                    eTag: new GitHubETag(eTag)
                });
            })
            .catch((errorResponse: any) => {
                // Handle 304 modified as no contents response
                // https://developer.github.com/v3/activity/events/
                if (errorResponse.status === 304) {
                    console.log("getEvents: response.status: 304");
                    return {
                        response: [],
                        eTag: errorResponse.headers.etag
                    };
                }
                return onError(errorResponse);
            });
    }
}
