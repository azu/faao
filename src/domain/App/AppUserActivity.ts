// MIT © 2017 azu
import { GitHubSearchStream } from "../GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";

export class AppUserActivity {
    openedStream?: GitHubSearchStream;
    openedItem?: GitHubSearchResultItem;

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
}