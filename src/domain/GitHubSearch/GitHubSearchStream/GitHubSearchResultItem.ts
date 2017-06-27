import { Identifier } from "../../Entity";

export interface Owner {
    login: string;
    id: number;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}

export interface User {
    login: string;
    id: number;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
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
    avatar_url: String;
    gravatar_id: String;
    url: String;
    html_url: String;
    followers_url: String;
    following_url: String;
    gists_url: String;
    starred_url: String;
    subscriptions_url: String;
    organizations_url: String;
    repos_url: String;
    events_url: String;
    received_events_url: String;
    type: String;
    site_admin: Boolean;
}

export interface Creator {
    login: string;
    id: Number;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}

export interface Milestone {
    url: string;
    html_url: string;
    labels_url: string;
    id: number;
    number: number;
    title: string;
    description: string;
    creator: Creator;
    open_issues: number;
    closed_issues: number;
    state: string;
    created_at: string;
    updated_at: string;
    due_on: string;
    closed_at?: any;
}

export interface PullRequest {
    url: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
}

export interface Repository {
    id: number;
    name: string;
    full_name: string;
    owner: Owner;
    private: boolean;
    html_url: string;
    description: string;
    fork: boolean;
    url: string;
    forks_url: string;
    keys_url: string;
    collaborators_url: string;
    teams_url: string;
    hooks_url: string;
    issue_events_url: string;
    events_url: string;
    assignees_url: string;
    branches_url: string;
    tags_url: string;
    blobs_url: string;
    git_tags_url: string;
    git_refs_url: string;
    trees_url: string;
    statuses_url: string;
    languages_url: string;
    stargazers_url: string;
    contributors_url: string;
    subscribers_url: string;
    subscription_url: string;
    commits_url: string;
    git_commits_url: string;
    comments_url: string;
    issue_comment_url: string;
    contents_url: string;
    compare_url: string;
    merges_url: string;
    archive_url: string;
    downloads_url: string;
    issues_url: string;
    pulls_url: string;
    milestones_url: string;
    notifications_url: string;
    labels_url: string;
}

// parse string
// camelCase
export interface GitHubSearchResultItemJSON {
    url: string;
    repository_url: string;
    labels_url: string;
    comments_url: string;
    events_url: string;
    html_url: string;
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
    created_at: string;
    updated_at: string;
    closed_at?: any;
    body: string;
    score: number;
}

const ghUrlToObject = require("github-url-to-object");

export class GitHubSearchResultItem {
    id: Identifier<GitHubSearchResultItem>;
    url: string;
    repository_url: string;
    labels_url: string;
    comments_url: string;
    events_url: string;
    html_url: string;
    number: number;
    title: string;
    user: User;
    labels: Label[];
    state: "merged" | "closed" | "open";
    pull_request?: PullRequest;
    locked: boolean;
    assignee: Assignee | any;
    assignees: Assignee[];
    milestone: Milestone | any;
    comments: number;
    created_at: string;
    updated_at: string;
    body: string;
    score: number;

    constructor(item: GitHubSearchResultItemJSON) {
        Object.assign(this, item, {
            id: new Identifier<GitHubSearchResultItem>(String(item.id))
        });
    }

    get createdAtDate() {
        return new Date(this.created_at);
    }

    get updatedAtDate() {
        return new Date(this.updated_at);
    }

    // type: https://developer.github.com/v3/search/#search-issues
    get type(): "issue" | "pr" {
        if (this.pull_request) {
            return "pr";
        } else {
            return "issue";
        }
    }

    // owner/repo
    get shortPath() {
        // https://github.com/zeke/github-url-to-object#github-enterprise
        const isEnterprise = !this.html_url.startsWith("https://github.com/");
        const object = ghUrlToObject(this.html_url, { enterprise: isEnterprise });
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
