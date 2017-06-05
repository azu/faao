// MIT © 2017 azu
import { Store } from "almin";
import { GitHubSearchStream } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { GitHubSearchStreamRepository } from "../../infra/repository/GitHubSearchStreamRepository";
import sortBy from "lodash.sortby";

export interface GitHubSearchStreamStateObject {
    items: GitHubSearchResultItem[];
}

type SortType = "updated" | "created";
const sortType = "update";

export class GitHubSearchStreamState {
    items: GitHubSearchResultItem[];
    sortedItems: GitHubSearchResultItem[];

    constructor(state: GitHubSearchStreamStateObject) {
        this.items = state.items;
        // sortedItems
        this.sortedItems = sortBy(this.items, (item: GitHubSearchResultItem) => {
            return item.updatedAt;
        }).reverse();
    }

    update(stream: GitHubSearchStream) {
        return new GitHubSearchStreamState({
            ...this as GitHubSearchStreamState,
            items: stream.itemSortedCollection.items
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
            items: []
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