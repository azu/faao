import { GitHubSearchQueryFactory } from "./GitHubSearchQueryFactory";
import { isGitHubSearchQueryJSON } from "./GitHubSearchQuery";
import { FaaoSearchQuery, isFaaoSearchQueryJSON } from "./FaaoSearchQuery";
import { UnionQuery, UnionQueryJSON } from "./QueryRole";
import { GitHubNotificationQuery, isGitHubNotificationQueryJSON } from "./GitHubNotificationQuery";
import {
    GitHubReceivedEventsForUserQuery,
    isGitHubReceivedEventsForUserQueryJSON
} from "./GitHubReceivedEventsForUserQuery";

export const createQueryFromUnionQueryJSON = (queryJSON: UnionQueryJSON): UnionQuery => {
    if (isGitHubReceivedEventsForUserQueryJSON(queryJSON)) {
        console.log("THISI S EFVENTES", queryJSON);
        return GitHubReceivedEventsForUserQuery.fromJSON(queryJSON);
    } else if (isGitHubNotificationQueryJSON(queryJSON)) {
        return GitHubNotificationQuery.fromJSON(queryJSON);
    } else if (isGitHubSearchQueryJSON(queryJSON)) {
        return GitHubSearchQueryFactory.createFromJSON(queryJSON);
    } else if (isFaaoSearchQueryJSON(queryJSON)) {
        return FaaoSearchQuery.fromJSON(queryJSON);
    } else {
        return fail(queryJSON);
    }
};

function fail(query: never): never {
    console.error("query", query);
    throw new Error("Fail to compile");
}
