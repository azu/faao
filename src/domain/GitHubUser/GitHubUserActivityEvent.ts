// MIT © 2017 azu
import { Identifier } from "../Entity";
import { ValueObject } from "../ValueObject";

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

export class GitHubUserActivityEvent extends ValueObject {
    id: Identifier<GitHubUserActivityEvent>;
    type: EventType;
    public: boolean;
    payload: any;
    repo: Repo;
    actor: Actor;
    org: Org;
    created_at: string;

    constructor(event: Partial<GitHubUserActivityEvent>) {
        super();
        Object.assign(this, event);
    }

    equals(event: GitHubUserActivityEvent): boolean {
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
