// MIT © 2017 azu
import { GitHubSearchStream } from "../GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { GitHubSearchQuery } from "../GitHubSearch/GitHubSearchList/GitHubSearchQuery";

export class AppUserActivity {
    openedStream?: GitHubSearchStream;
    openedItem?: GitHubSearchResultItem;
    openedQuery?: GitHubSearchQuery;

    get activeQuery(): GitHubSearchQuery | undefined {
        return this.openedQuery;
    }

    get activeStream(): GitHubSearchStream | undefined {
        return this.openedStream;
    }

    get activeItem(): GitHubSearchResultItem | undefined {
        return this.openedItem;
    }

    addStream(stream: GitHubSearchStream) {
        this.openedStream = stream;
    }

    addItem(item: GitHubSearchResultItem) {
        this.openedItem = item;
    }

    addQuery(query: GitHubSearchQuery) {
        this.openedQuery = query;
    }
}