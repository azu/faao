// MIT © 2017 azu
import { Store } from "almin";
import { GitHubSearchStream } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { GitHubSearchStreamRepository } from "../../infra/repository/GitHubSearchStreamRepository";

export interface GitHubSearchStreamStateObject {
    items: GitHubSearchResultItem[];
    sortedItems: GitHubSearchResultItem[];
}

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

export class GitHubSearchStreamState {
    items: GitHubSearchResultItem[];
    sortedItems: GitHubSearchStreamStateItem[];

    constructor(state: GitHubSearchStreamStateObject) {
        this.items = state.items;
        this.sortedItems = state.sortedItems.map(item => new GitHubSearchStreamStateItem(item));
    }

    update(stream: GitHubSearchStream) {
        return new GitHubSearchStreamState({
            ...this as GitHubSearchStreamState,
            items: stream.items,
            sortedItems: stream.itemSortedCollection.items
        });
    }
}

export class GitHubSearchStreamStore extends Store<GitHubSearchStreamState> {
    state: GitHubSearchStreamState;
    gitHubSearchStreamRepository: GitHubSearchStreamRepository;

    constructor(gitHubSearchStreamRepository: GitHubSearchStreamRepository) {
        super();
        this.gitHubSearchStreamRepository = gitHubSearchStreamRepository;
        this.state = new GitHubSearchStreamState({
            items: [],
            sortedItems: []
        });
    }

    receivePayload() {
        // TODO: display query
        const stream = this.gitHubSearchStreamRepository.get();
        this.setState(this.state.update(stream));
    }

    getState() {
        return this.state;
    }
}
