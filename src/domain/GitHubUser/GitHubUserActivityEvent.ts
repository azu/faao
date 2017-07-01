// MIT © 2017 azu
import { Identifier } from "../Entity";
import { ValueObject } from "../ValueObject";
import { compile, parse, ParsedEvent } from "parse-github-event";

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

const ghUrlToObject = require("github-url-to-object");

export class GitHubUserActivityEvent extends ValueObject {
    id: Identifier<GitHubUserActivityEvent>;
    type: EventType;
    public: boolean;
    payload: any;
    repo: Repo;
    actor: Actor;
    org: Org;
    created_at: string;

    parsedEvent?: ParsedEvent;

    constructor(event: Partial<GitHubUserActivityEvent>) {
        super();
        Object.assign(this, event);
        this.parsedEvent = parse(this.toJSON());
    }

    // owner/repo
    get shortPath() {
        // https://github.com/zeke/github-url-to-object#github-enterprise
        const isEnterprise = !this.htmlURL.startsWith("https://github.com/");
        const object = ghUrlToObject(this.htmlURL, { enterprise: isEnterprise });
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

    equals(event?: GitHubUserActivityEvent): boolean {
        if (!event) {
            return false;
        }
        return this.id.equals(event.id);
    }

    static fromJSON(json: GitHubUserActivityEventJSON): GitHubUserActivityEvent {
        return new GitHubUserActivityEvent({
            ...json,
            id: new Identifier<GitHubUserActivityEvent>(json.id)
        });
    }

    toJSON(): GitHubUserActivityEventJSON {
        return {
            ...this as GitHubUserActivityEvent,
            id: this.id.toValue()
        };
    }
}
