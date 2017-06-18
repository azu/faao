// MIT © 2017 azu
import { GitHubSearchStream } from "../GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { GitHubSearchQuery } from "../GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchList } from "../GitHubSearch/GitHubSearchList/GitHubSearchList";

export class AppUserActivity {
    openedStream?: GitHubSearchStream;
    openedItem?: GitHubSearchResultItem;
    openedQuery?: GitHubSearchQuery;
    openedSearchList?: GitHubSearchList;

    /**
     * active search is SearchList mode or SearchQuery mode.
     */
    get activeSearch(): GitHubSearchList | GitHubSearchQuery | undefined {
        if (this.activeSearchList && !this.activeQuery) {
            return this.activeSearchList;
        } else if (this.activeQuery) {
            return this.activeQuery;
        }
        return;
    }

    get activeQuery(): GitHubSearchQuery | undefined {
        return this.openedQuery;
    }

    get activeSearchList(): GitHubSearchList | undefined {
        return this.openedSearchList;
    }

    get activeStream(): GitHubSearchStream | undefined {
        return this.openedStream;
    }

    get activeItem(): GitHubSearchResultItem | undefined {
        return this.openedItem;
    }

    activateStream(stream: GitHubSearchStream) {
        this.openedStream = stream;
    }

    activateItem(item: GitHubSearchResultItem) {
        this.openedItem = item;
    }

    activateSearchList(searchList: GitHubSearchList) {
        this.openedSearchList = searchList;
        this.openedQuery = undefined;
    }

    activateQuery(searchList: GitHubSearchList, query: GitHubSearchQuery) {
        this.openedSearchList = searchList;
        this.openedQuery = query;
    }
}
