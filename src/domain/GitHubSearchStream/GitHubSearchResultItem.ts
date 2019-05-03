import { Identifier } from "../Entity";
import { string } from "prop-types";

const ghUrlToObject = require("github-url-to-object");

export interface User {
    login: string;
    avatar_url: string;
    html_url: string;
}

export interface Label {
    url: string;
    name: string;
    color: string;
    default: boolean;
}

export interface Assignee {
    login: string;
    avatar_url: string;
    html_url: string;
}

export interface Milestone {
    html_url: string;
    title: string;
    description: string;
    state: string;
    created_at: string;
    updated_at: string;
    due_on?: string | null;
    closed_at?: string | null;
}

// parse string
// camelCase
export interface GitHubSearchResultItemJSON {
    html_url: string;
    id: string;
    number: number;
    title: string;
    user: User;
    labels: Label[];
    state: "merged" | "closed" | "open";
    locked: boolean;
    assignees: Assignee[];
    milestone: Milestone | null;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at?: string | null;
    body: string;
    // computed from response
    type: "pr" | "issue";
}

export class GitHubSearchResultItem {
    id: Identifier<GitHubSearchResultItem>;
    body: string;
    html_url: string;
    number: number;
    title: string;
    user: User;
    labels: Label[];
    state: "merged" | "closed" | "open";
    locked: boolean;
    assignees: Assignee[];
    milestone: Milestone | null;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at?: string | null;
    // computed from response
    type: "pr" | "issue";

    constructor(item: GitHubSearchResultItemJSON) {
        this.id = new Identifier<GitHubSearchResultItem>(String(item.id));
        this.body = item.body;
        this.html_url = item.html_url;
        this.number = item.number;
        this.title = item.title;
        this.user = item.user;
        this.labels = item.labels;
        this.state = item.state;
        this.locked = item.locked;
        this.assignees = item.assignees;
        this.milestone = item.milestone;
        this.comments = item.comments;
        this.created_at = item.created_at;
        this.updated_at = item.updated_at;
        this.closed_at = item.closed_at;
        // type: https://developer.github.com/v3/search/#search-issues
        this.type = item.type;
    }

    get createdAtDate() {
        return new Date(this.created_at);
    }

    get updatedAtDate() {
        return new Date(this.updated_at);
    }

    // owner/repo
    get shortPath() {
        // https://github.com/zeke/github-url-to-object#github-enterprise
        const isEnterprise = !this.html_url.startsWith("https://github.com/");
        const object = ghUrlToObject(this.html_url, { enterprise: isEnterprise });
        return `${object.user}/${object.repo}`;
    }

    get repositoryHtmlUrl() {
        // https://github.com/zeke/github-url-to-object#github-enterprise
        const isEnterprise = !this.html_url.startsWith("https://github.com/");
        const object = ghUrlToObject(this.html_url, { enterprise: isEnterprise });
        return object.https_url;
    }

    /**
     * Is `value` included in title, body?
     */
    includes(value: string): boolean {
        if (this.title.includes(value)) {
            return true;
        }
        if (this.html_url.includes(value)) {
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

    isLaterThan(item: GitHubSearchResultItem): boolean {
        return this.updatedAtDate > item.updatedAtDate;
    }

    static fromJSON(json: GitHubSearchResultItemJSON): GitHubSearchResultItem {
        const proto = Object.create(GitHubSearchResultItem.prototype);
        return Object.assign(proto, json, {
            id: new Identifier<GitHubSearchResultItem>(String(json.id))
        });
    }

    toJSON(): GitHubSearchResultItemJSON {
        return Object.assign({}, this, {
            id: String(this.id.toValue())
        });
    }
}
