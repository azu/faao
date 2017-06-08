// MIT © 2017 azu
import { Store } from "almin";
import { GitHubSearchStream } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { GitHubSearchStreamRepository } from "../../infra/repository/GitHubSearchStreamRepository";
import { AppRepository } from "../../infra/repository/AppRepository";
import { GitHubSearchStreamStateItem } from "./GitHubSearchStreamStateItem";

const filterable = require("filterable");

export interface GitHubSearchStreamStateObject {
    items: GitHubSearchResultItem[];
    sortedItems: GitHubSearchResultItem[];
}

export class GitHubSearchStreamState {
    items: GitHubSearchResultItem[];
    displayItems: GitHubSearchStreamStateItem[];

    constructor(state: GitHubSearchStreamStateObject) {
        this.items = state.items;
        this.displayItems = state.sortedItems.map(item => new GitHubSearchStreamStateItem(item));

        const query = filterable.Query("Refresh state:open").parse();
        this.displayItems = this.displayItems.filter((item: any) => {
            return query.toJSON().every((query: any): boolean => {
                if (!item.hasOwnProperty(query.field)) {
                    // full match
                    return item.includes(query.value);
                }
                if (query.type === "=") {
                    console.log(item[query.field] === query.value, item);
                    return item[query.field] === query.value;
                } else if (query.type === ">") {
                    return item[query.field] > query.value;
                } else if (query.type === ">=") {
                    return item[query.field] >= query.value;
                } else if (query.type === "<") {
                    return item[query.field] < query.value;
                } else if (query.type === "<=") {
                    return item[query.field] <= query.value;
                }
                return false;
            });
        });
        console.log(query.toJSON());
    }

    get hasResult(): boolean {
        return this.displayItems.length > 0;
    }

    update(stream?: GitHubSearchStream) {
        if (!stream) {
            return this;
        }
        return new GitHubSearchStreamState({
            ...this as GitHubSearchStreamState,
            items: stream.items,
            sortedItems: stream.itemSortedCollection.items
        });
    }
}

export class GitHubSearchStreamStore extends Store<GitHubSearchStreamState> {
    state: GitHubSearchStreamState;

    constructor(public appRepository: AppRepository) {
        super();
        this.state = new GitHubSearchStreamState({
            items: [],
            sortedItems: []
        });
    }

    receivePayload() {
        const app = this.appRepository.get();
        const activeStream = app.user.activity.activeStream;
        this.setState(this.state.update(activeStream));
    }

    getState() {
        return this.state;
    }
}
