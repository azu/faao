import { GitHubSearchStreamStateItem } from "../../../store/GitHubSearchStreamStore/GitHubSearchStreamStateItem";
import { GitHubActiveItem } from "./GitHubActiveItem";
import { Identifier } from "../../Entity";
import { SortedCollectionItem } from "../../GitHubSearchStream/SortedCollection";

export const convertFromStateItemToActiveItem = (
    item: GitHubSearchStreamStateItem
): GitHubActiveItem => {
    return new GitHubActiveItem({
        id: new Identifier<GitHubActiveItem>(item.idString),
        html_url: item.html_url,
        repository_html_url: item.html_url
    });
};
export const convertFromSortedItemToActiveItem = (item: SortedCollectionItem): GitHubActiveItem => {
    return new GitHubActiveItem({
        id: new Identifier<GitHubActiveItem>(item.id.toValue()),
        html_url: item.html_url,
        repository_html_url: item.html_url
    });
};
