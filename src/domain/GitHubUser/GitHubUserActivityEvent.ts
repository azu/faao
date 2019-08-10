// MIT © 2017 azu
import { Identifier } from "../Entity";
import { ValueObject } from "../ValueObject";
import { compile, parse, ParsedEvent } from "parse-github-event";
import * as url from "url";
import urljoin from "url-join";
import ghUrlToObject from "github-url-to-object";

export interface Payload {}

export interface Repo {
    id: number;
    name: string;
    url: string;
}

export interface Actor {
    id: number;
    login: string;
    gravatar_id: string;
    avatar_url: string;
    url: string;
}

export interface Org {
    id: number;
    login: string;
    gravatar_id: string;
    url: string;
    avatar_url: string;
}

export type EventType =
    | "CommitCommentEvent"
    | "CreateEvent"
    | "DeleteEvent"
    | "DeploymentEvent"
    | "DeploymentStatusEvent"
    | "DownloadEvent"
    | "FollowEvent"
    | "ForkEvent"
    | "ForkApplyEvent"
    | "GistEvent"
    | "GollumEvent"
    | "InstallationEvent"
    | "InstallationRepositoriesEvent"
    | "IssueCommentEvent" //
    | "IssuesEvent" //
    | "LabelEvent" //
    | "MarketplacePurchaseEvent"
    | "MemberEvent"
    | "MembershipEvent"
    | "MilestoneEvent"
    | "OrganizationEvent"
    | "OrgBlockEvent"
    | "PageBuildEvent"
    | "ProjectCardEvent"
    | "ProjectColumnEvent"
    | "ProjectEvent"
    | "PublicEvent"
    | "PullRequestEvent" //
    | "PullRequestReviewEvent" //
    | "PullRequestReviewCommentEvent" //
    | "PushEvent" //
    | "ReleaseEvent" //
    | "RepositoryEvent"
    | "StatusEvent"
    | "TeamEvent"
    | "TeamAddEvent"
    | "WatchEvent";

export interface GitHubUserActivityEventJSON {
    id: string;
    type: EventType;
    public: boolean;
    payload: any;
    repo: Repo;
    actor: Actor;
    org: Org;
    created_at: string;
}

/**
 * get origin from url
 */
export function getOriginFromURL(URL: string) {
    if (!URL) {
        return null;
    }
    const obj = url.parse(URL);
    if (!obj.protocol && !obj.hostname) {
        return null;
    }
    return `${obj.protocol}//${obj.hostname}${obj.port ? `:${obj.port}` : ""}`;
}

export class GitHubUserActivityEvent extends ValueObject {
    id: Identifier<GitHubUserActivityEvent>;
    type: EventType;
    public: boolean;
    isRead: boolean;
    payload: any;
    repo: Repo;
    actor: Actor;
    org: Org;
    created_at: string;

    parsedEvent?: ParsedEvent;

    constructor(event: GitHubUserActivityEvent) {
        super();
        this.id = event.id;
        this.type = event.type;
        this.public = event.public;
        this.isRead = event.isRead;
        this.payload = event.payload;
        this.repo = event.repo;
        this.actor = event.actor;
        this.org = event.org;
        this.created_at = event.created_at;
        this.parsedEvent = parse(this.toJSON() as any);
    }

    get repoAvatarUrl() {
        if (this.org) {
            return this.org.avatar_url;
        } else if (this.repo) {
            const isEnterprise = !this.htmlURL.startsWith("https://github.com/");
            const object = ghUrlToObject(this.htmlURL, { enterprise: isEnterprise });
            if (!object) {
                console.warn("object is null");
                return "";
            }
            const origin = getOriginFromURL(object.https_url);
            if (origin) {
                return urljoin(origin, `${object.user}.png?size=20`);
            }
        }
        return this.actor.avatar_url;
    }

    // owner/repo
    get shortPath() {
        // https://github.com/zeke/github-url-to-object#github-enterprise
        const isEnterprise = !this.htmlURL.startsWith("https://github.com/");
        const object = ghUrlToObject(this.htmlURL, { enterprise: isEnterprise });
        if (!object) {
            console.warn("object is null");
            return "";
        }
        return `${object.user}/${object.repo}`;
    }

    get htmlURL() {
        if (!this.parsedEvent) {
            return "";
        }
        return this.parsedEvent.html_url;
    }

    get description() {
        if (!this.parsedEvent) {
            return "NO DATA";
        }
        return compile(this.parsedEvent);
    }

    get createAtDate(): Date {
        return new Date(this.created_at);
    }

    includes(text: string): boolean {
        if (this.htmlURL.includes(text)) {
            return true;
        }
        if (this.description.includes(text)) {
            return true;
        }
        if (this.shortPath.includes(text)) {
            return true;
        }
        if (this.actor.login.includes(text)) {
            return true;
        }
        return false;
    }

    equals(event?: GitHubUserActivityEvent): boolean {
        if (!event) {
            return false;
        }
        return this.id.equals(event.id);
    }

    static fromJSON(json: GitHubUserActivityEventJSON): GitHubUserActivityEvent {
        // FIXME: fix type
        // @ts-ignore
        return new GitHubUserActivityEvent({
            ...json,
            id: new Identifier<GitHubUserActivityEvent>(json.id)
        });
    }

    toJSON(): GitHubUserActivityEventJSON {
        return {
            id: this.id.toValue(),
            type: this.type,
            public: this.public,
            payload: this.payload,
            repo: this.repo,
            actor: this.actor,
            org: this.org,
            created_at: this.created_at
        };
    }
}
