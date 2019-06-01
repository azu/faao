import { App } from "../App/App";
import { GitHubSearchStream } from "./GitHubSearchStream";
import { OSNotice } from "../Notice/OSNotice";
import { UnionQuery } from "../GitHubSearchList/GitHubSearchList";
import { from } from "fromfrom";

/**
 * Create OS Notices from updated Streams.
 * @param app
 * @param query
 * @param firstStream
 * @param lastStream
 */
export const createOSNoticesFromStreams = ({
    app,
    query,
    firstStream,
    lastStream
}: {
    app: App;
    query: UnionQuery;
    firstStream?: GitHubSearchStream;
    lastStream?: GitHubSearchStream;
}): OSNotice[] => {
    // Notice updated results
    // First results is ignored
    if (!lastStream || !firstStream) {
        return [];
    }
    if (!firstStream.hasResultAtLeastOne) {
        return [];
    }
    const diff = lastStream.itemSortedCollection.differenceCollection(
        firstStream.itemSortedCollection
    );
    return from(diff.items)
        .filter(item => {
            return app.user.activity.notificationActity.timeStamp < item.updatedAtDate.getTime();
        })
        .sortBy(item => {
            return item.updated_at;
        })
        .map(item => {
            return new OSNotice({
                title: item.title,
                body: item.body,
                subTitle: item.shortPath,
                icon: item.user.avatar_url,
                refs: {
                    query: query,
                    item: item
                }
            });
        })
        .toArray();
};
