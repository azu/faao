// MIT © 2017 azu
import {
    GitHubSearchResultItem,
    isGitHubSearchResultItem,
    Label
} from "../../domain/GitHubSearchStream/GitHubSearchResultItem";
import moment from "moment";
import {
    EventType,
    GitHubUserActivityEvent,
    isGitHubUserActivityEvent
} from "../../domain/GitHubUser/GitHubUserActivityEvent";
import { SortedCollectionItem } from "../../domain/GitHubSearchStream/SortedCollection";
import { Identifier } from "../../domain/Entity";

export type IconType =
    | "IssueOpenedIcon"
    | "IssueClosedIcon"
    | "GitPullRequestIcon"
    | "GitMergeIcon"
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
    | "IssueCommentEvent"
    | "IssuesEvent"
    | "LabelEvent"
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
    | "PullRequestEvent"
    | "PullRequestReviewEvent"
    | "PullRequestReviewCommentEvent"
    | "PushEvent"
    | "ReleaseEvent"
    | "RepositoryEvent"
    | "StatusEvent"
    | "TeamEvent"
    | "TeamAddEvent"
    | "WatchEvent"
    | string;

export class GitHubSearchStreamStateItem implements SortedCollectionItem {
    private originalItem: GitHubSearchResultItem | GitHubUserActivityEvent;
    readonly created_at: string;
    readonly updated_at: string;

    isLaterThan(aTarget: any): boolean {
        return this.originalItem.isLaterThan(aTarget);
    }

    includes(aTarget: string): boolean {
        return this.originalItem.includes(aTarget);
    }

    toJSON(): {} {
        return this.originalItem.toJSON();
    }

    id: Identifier<any>;
    public isRead: boolean;
    readonly type: "pr" | "issue" | EventType;
    readonly state: any;
    readonly updatedAtDate: Date;
    readonly labels: Label[];
    readonly html_url: string;
    readonly title: string;
    readonly body: string;
    readonly avatarUrl: string;
    readonly userName: string;
    readonly shortPath: string;
    readonly comments: number | null;
    readonly idString: string;

    constructor(
        item: GitHubSearchResultItem | GitHubUserActivityEvent | SortedCollectionItem,
        isRead: boolean
    ) {
        if (!(isGitHubSearchResultItem(item) || isGitHubUserActivityEvent(item))) {
            console.error("Unknown Item", item);
            throw new Error("Unknown Item" + item);
        }
        this.originalItem = item;
        this.id = item.id;
        this.idString = item.id.toValue();
        this.type = item.type;
        this.userName = isGitHubSearchResultItem(item) ? item.userName : item.shortPath;
        this.shortPath = isGitHubSearchResultItem(item) ? item.userName : item.shortPath;
        this.state = isGitHubSearchResultItem(item) ? item.state : "open";
        this.isRead = isRead;
        this.comments = isGitHubSearchResultItem(item) ? item.comments : null;
        this.labels = isGitHubSearchResultItem(item) ? item.labels : [];
        this.title = item.title;
        this.body = item.body || "";
        this.html_url = item.html_url;
        this.avatarUrl = item.avatarUrl;
        this.updatedAtDate = item.updatedAtDate;
        this.updated_at = item.updated_at;
        this.created_at = item.created_at;
    }

    get iconType(): IconType {
        if (this.type === "pr") {
            if (this.state === "merged") {
                return "GitMergeIcon";
            } else {
                return "GitPullRequestIcon";
            }
        } else if (this.type === "issue") {
            if (this.state === "open") {
                return "IssueOpenedIcon";
            } else {
                return "IssueClosedIcon";
            }
        } else {
            // TODO: Event Icon Type
            return this.type;
        }
    }

    get iconColor(): string {
        switch (this.state) {
            case "open": // Issue | PR opened
                return "#28a745";
            case "closed": // Issue | PR closed
                return "#cb2431";
            case "merged": // PR merged
                // FIXME: It is not work
                // because GitHub API not return "closed" insteadof "merged"
                return "#6f42c1";
            default:
                return "#dddddd";
        }
    }

    get formattedUpdatedDateString(): string {
        return moment(this.updatedAtDate).fromNow();
    }

    equals(item?: any): boolean {
        return this.id.equals(item && item.id);
    }
}
