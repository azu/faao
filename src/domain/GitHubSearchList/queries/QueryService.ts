import { GitHubSearchQueryFactory } from "./GitHubSearchQueryFactory";
import { isGitHubSearchQueryJSON } from "./GitHubSearchQuery";
import { FaaoSearchQuery, isFaaoSearchQueryJSON } from "./FaaoSearchQuery";
import { UnionQuery, UnionQueryJSON } from "./QueryRole";
import { GitHubNotificationQuery, isGitHubNotificationQueryJSON } from "./GitHubNotificationQuery";

export const createQueryFromUnionQueryJSON = (queryJSON: UnionQueryJSON): UnionQuery => {
    if (isGitHubNotificationQueryJSON(queryJSON)) {
        return GitHubNotificationQuery.fromJSON(queryJSON);
    } else if (isGitHubSearchQueryJSON(queryJSON)) {
        return GitHubSearchQueryFactory.createFromJSON(queryJSON);
    } else if (isFaaoSearchQueryJSON(queryJSON)) {
        return FaaoSearchQuery.fromJSON(queryJSON);
    }
    throw new Error("Should not reach" + queryJSON);
};
