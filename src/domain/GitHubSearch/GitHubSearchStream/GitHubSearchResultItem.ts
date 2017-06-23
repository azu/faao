import { Identifier } from "../../Entity";

export interface Owner {
    login: string;
    id: number;
    avatarUrl: string;
    gravatarId: string;
    url: string;
    htmlUrl: string;
    FollowersUrl: string;
    followingUrl: string;
    gistsUrl: string;
    starredUrl: string;
    subscriptionsUrl: string;
    organizationsUrl: string;
    reposUrl: string;
    eventsUrl: string;
    receivedEventsUrl: string;
    type: string;
    siteAdmin: boolean;
}

export interface User {
    login: string;
    id: number;
    avatarUrl: string;
    gravatarId: string;
    url: string;
    htmlUrl: string;
    followersUrl: string;
    followingUrl: string;
    gistsUrl: string;
    starredUrl: string;
    subscriptionsUrl: string;
    organizationsUrl: string;
    reposUrl: string;
    eventsUrl: string;
    receivedEventsUrl: string;
    type: string;
    siteAdmin: boolean;
}

export interface Label {
    id: number;
    url: string;
    name: string;
    color: string;
    default: boolean;
}

export interface Assignee {
    login: String;
    id: Number;
    avatarUrl: String;
    gravatarId: String;
    url: String;
    htmlUrl: String;
    followersUrl: String;
    followingUrl: String;
    gistsUrl: String;
    starredUrl: String;
    subscriptionsUrl: String;
    organizationsUrl: String;
    reposUrl: String;
    eventsUrl: String;
    receivedEventsUrl: String;
    type: String;
    siteAdmin: Boolean;
}

export interface Creator {
    login: string;
    id: Number;
    avatarUrl: string;
    gravatarId: string;
    url: string;
    htmlUrl: string;
    followersUrl: string;
    followingUrl: string;
    gistsUrl: string;
    starredUrl: string;
    subscriptionsUrl: string;
    organizationsUrl: string;
    reposUrl: string;
    eventsUrl: string;
    receivedEventsUrl: string;
    type: string;
    siteAdmin: boolean;
}

export interface Milestone {
    url: string;
    htmlUrl: string;
    labelsUrl: string;
    id: number;
    number: number;
    title: string;
    description: string;
    creator: Creator;
    openIssues: number;
    closedIssues: number;
    state: string;
    createdAt: string;
    updatedAt: string;
    dueOn: string;
    closedAt?: any;
}

export interface PullRequest {
    url: string;
    htmlUrl: string;
    diffUrl: string;
    patchUrl: string;
}

export interface Repository {
    id: number;
    name: string;
    fullName: string;
    owner: Owner;
    private: boolean;
    htmlUrl: string;
    description: string;
    fork: boolean;
    url: string;
    forksUrl: string;
    keysUrl: string;
    collaboratorsUrl: string;
    teamsUrl: string;
    hooksUrl: string;
    issueEventsUrl: string;
    eventsUrl: string;
    assigneesUrl: string;
    branchesUrl: string;
    tagsUrl: string;
    blobsUrl: string;
    gitTagsUrl: string;
    gitRefsUrl: string;
    treesUrl: string;
    statusesUrl: string;
    languagesUrl: string;
    stargazersUrl: string;
    contributorsUrl: string;
    subscribersUrl: string;
    subscriptionUrl: string;
    commitsUrl: string;
    gitCommitsUrl: string;
    commentsUrl: string;
    issueCommentUrl: string;
    contentsUrl: string;
    compareUrl: string;
    mergesUrl: string;
    archiveUrl: string;
    downloadsUrl: string;
    issuesUrl: string;
    pullsUrl: string;
    milestonesUrl: string;
    notificationsUrl: string;
    labelsUrl: string;
}

// parse string
// camelCase
export interface GitHubSearchResultItemJSON {
    url: string;
    repositoryUrl: string;
    labelsUrl: string;
    commentsUrl: string;
    eventsUrl: string;
    htmlUrl: string;
    id: number;
    number: number;
    title: string;
    user: User;
    labels: Label[];
    state: string;
    locked: boolean;
    assignee: Assignee | null;
    assignees: Assignee[];
    milestone: Milestone | null;
    comments: number;
    createdAt: string;
    updatedAt: string;
    closedAt?: any;
    body: string;
    score: number;
}

const ghUrlToObject = require("github-url-to-object");

export class GitHubSearchResultItem {
    id: Identifier<GitHubSearchResultItem>;
    url: string;
    repositoryUrl: string;
    labelsUrl: string;
    commentsUrl: string;
    eventsUrl: string;
    htmlUrl: string;
    number: number;
    title: string;
    user: User;
    labels: Label[];
    state: "merged" | "closed" | "open";
    pullRequest?: PullRequest;
    locked: boolean;
    assignee: Assignee | any;
    assignees: Assignee[];
    milestone: Milestone | any;
    comments: number;
    createdAt: string;
    updatedAt: string;
    body: string;
    score: number;

    constructor(item: GitHubSearchResultItemJSON) {
        Object.assign(this, item, {
            id: new Identifier<GitHubSearchResultItem>(String(item.id))
        });
    }

    get createdAtDate() {
        return new Date(this.createdAt);
    }

    get updatedAtDate() {
        return new Date(this.updatedAt);
    }

    // type: https://developer.github.com/v3/search/#search-issues
    get type(): "issue" | "pr" {
        if (this.pullRequest) {
            return "pr";
        } else {
            return "issue";
        }
    }

    // owner/repo
    get shortPath() {
        // https://github.com/zeke/github-url-to-object#github-enterprise
        const isEnterprise = !this.htmlUrl.startsWith("https://github.com/");
        const object = ghUrlToObject(this.htmlUrl, { enterprise: isEnterprise });
        return `${object.user}/${object.repo}`;
    }

    /**
     * Is `value` included in title, body?
     */
    includes(value: string): boolean {
        if (this.title.includes(value)) {
            return true;
        }
        if (this.url.includes(value)) {
            return true;
        }
        if (this.body.includes(value)) {
            return true;
        }
        return false;
    }

    equals(item?: GitHubSearchResultItem) {
        if (!item) {
            return false;
        }
        return this.id.equals(item.id);
    }

    static fromJSON(json: GitHubSearchResultItemJSON): GitHubSearchResultItem {
        const proto = Object.create(GitHubSearchResultItem.prototype);
        return Object.assign(proto, json, {
            id: new Identifier<GitHubSearchResultItem>(String(json.id))
        });
    }

    toJSON(): GitHubSearchResultItemJSON {
        return Object.assign({}, this, {
            id: Number(this.id.toValue())
        });
    }
}
