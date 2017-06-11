// MIT © 2017 azu
import { GitHubSearchStream } from "../GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { GitHubSearchQuery } from "../GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchList } from "../GitHubSearch/GitHubSearchList/GitHubSearchList";

export class AppUserActivity {
    openedStream?: GitHubSearchStream;
    openedItem?: GitHubSearchResultItem;
    openedQuery?: GitHubSearchQuery | GitHubSearchList | undefined;

    get activeQuery(): GitHubSearchQuery | GitHubSearchList | undefined {
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

    addQuery(query: GitHubSearchQuery | GitHubSearchList | undefined) {
        this.openedQuery = query;
    }
}
