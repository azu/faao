// MIT © 2017 azu
import { GitHubSearchResultItem } from "../../domain/GitHubSearchStream/GitHubSearchResultItem";
import moment from "moment";

export type IconType =
    | "IssueOpenedIcon"
    | "IssueClosedIcon"
    | "GitPullRequestIcon"
    | "GitMergeIcon";
// TODO: it will be performance de-merit
// should measure performant
export class GitHubSearchStreamStateItem extends GitHubSearchResultItem {
    isRead: boolean;

    constructor(item: GitHubSearchResultItem, isRead: boolean) {
        // TODO: perf slow
        super(item.toJSON());
        this.isRead = isRead;
    }

    setRead(isRead: boolean): void {
        this.isRead = isRead;
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
        }
        console.error(new Error("Unknown icon type"), this);
        return "IssueOpenedIcon";
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
}
