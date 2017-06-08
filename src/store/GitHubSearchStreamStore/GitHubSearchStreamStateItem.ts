// MIT © 2017 azu
import { GitHubSearchResultItem } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";

export type IconType = "IssueOpenedIcon" | "IssueClosedIcon" | "GitPullRequestIcon" | "GitMergeIcon";
// TODO: it will be performance de-merit
// should measure performant
export class GitHubSearchStreamStateItem extends GitHubSearchResultItem {
    constructor(item: GitHubSearchResultItem) {
        super(item);
    }

    get iconType(): IconType {
        if (this.pullRequest) {
            if (this.state === "merged") {
                return "GitMergeIcon";
            } else {
                return "GitPullRequestIcon";
            }
        } else {
            if (this.state === "open") {
                return "IssueOpenedIcon";
            } else {
                return "IssueClosedIcon";
            }
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
        }
    }
}
