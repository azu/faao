import { IconType } from "../../../store/GitHubSearchStreamStore/GitHubSearchStreamStateItem";
import {
    Broadcast,
    Comment,
    Gist,
    GitCommit,
    GitMerge,
    GitPullRequest,
    Info,
    IssueClosed,
    IssueOpened,
    Milestone,
    Organization,
    Person,
    Plus,
    Project,
    Repo,
    RepoForked,
    Tag,
    Trashcan,
    Watch
} from "@primer/octicons-react";

export const createIcon = (iconType: IconType) => {
    switch (iconType) {
        case "CommitCommentEvent":
            return Comment;
        case "CreateEvent":
            return Plus;
        case "DeleteEvent":
            return Trashcan;
        case "DeploymentEvent":
            return Info;
        case "DeploymentStatusEvent":
            return Info;
        case "DownloadEvent":
            return Info;
        case "FollowEvent":
            return Person;
        case "ForkEvent":
            return RepoForked;
        case "ForkApplyEvent":
            return RepoForked;
        case "GistEvent":
            return Gist;
        case "GollumEvent":
            return Info;
        case "InstallationEvent":
            return Repo;
        case "InstallationRepositoriesEvent":
            return Repo;
        case "IssueCommentEvent":
            return IssueOpened;
        case "IssuesEvent":
            return IssueOpened;
        case "LabelEvent":
            return Tag;
        case "MarketplacePurchaseEvent":
            return Info;
        case "MemberEvent":
            return Organization;
        case "MembershipEvent":
            return Organization;
        case "MilestoneEvent":
            return Milestone;
        case "OrganizationEvent":
            return Organization;
        case "OrgBlockEvent":
            return Organization;
        case "PageBuildEvent":
            return Info;
        case "ProjectCardEvent":
            return Project;
        case "ProjectColumnEvent":
            return Project;
        case "ProjectEvent":
            return Project;
        case "PublicEvent":
            return Info;
        case "PullRequestEvent":
            return GitPullRequest;
        case "PullRequestReviewEvent":
            return GitPullRequest;
        case "PullRequestReviewCommentEvent":
            return GitPullRequest;
        case "PushEvent":
            return GitCommit;
        case "ReleaseEvent":
            return Tag;
        case "RepositoryEvent":
            return Repo;
        case "StatusEvent":
            return Info;
        case "TeamEvent":
            return Broadcast;
        case "TeamAddEvent":
            return Person;
        case "WatchEvent":
            return Watch;
        case "IssueOpenedIcon":
            return IssueOpened;
        case "IssueClosedIcon":
            return IssueClosed;
        case "GitPullRequestIcon":
            return GitMerge;
        case "GitMergeIcon":
            return GitPullRequest;
        default:
            return null;
    }
    return null;
};
