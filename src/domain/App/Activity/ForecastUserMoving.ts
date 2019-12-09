import { WhenReadItem } from "../ActivityHistory";
import { AppUser } from "../AppUser";
import { GitHubSearchStream } from "../../GitHubSearchStream/GitHubSearchStream";
import { SortedCollectionItem } from "../../GitHubSearchStream/SortedCollection";
import { GitHubActiveItem } from "./GitHubActiveItem";

export enum ForecastDirection {
    UP = 0,
    DOWN = 1
}

/**
 * Forecast User scroll directory using nextItem and History
 * if ↓ * 2 is alred read, the user scroll up?
 * @param appUser
 * @param activeSearchStream
 * @param nextItem
 */
export const forecastUserMoving = ({
    appUser,
    activeSearchStream,
    nextItem
}: {
    appUser: AppUser;
    activeSearchStream: GitHubSearchStream;
    nextItem: GitHubActiveItem | SortedCollectionItem;
}): ForecastDirection => {
    const prevItems = activeSearchStream.itemSortedCollection.sliceItemsFromCurrentItem(
        nextItem,
        2
    );
    // if ↓ * 2 is read, the user scroll up?
    const isUpperItemsRead = prevItems
        .map(item => {
            return appUser.activity.streamItemHistory.whenReadItem(item);
        })
        .some(WHEN_READ => {
            return WHEN_READ === WhenReadItem.RECENT;
        });
    return isUpperItemsRead ? ForecastDirection.DOWN : ForecastDirection.UP;
};
