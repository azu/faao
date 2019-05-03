import { GitHubSearchQueryFactory } from "./GitHubSearchQueryFactory";
import { isGitHubSearchQueryJSON } from "./GitHubSearchQuery";
import { FaaoSearchQuery, isFaaoSearchQueryJSON } from "./FaaoSearchQuery";
import { UnionQueryJSON } from "./GitHubSearchList";

export const createQueryFromUnionQueryJSON = (queryJSON: UnionQueryJSON) => {
    if (isGitHubSearchQueryJSON(queryJSON)) {
        return GitHubSearchQueryFactory.createFromJSON(queryJSON);
    } else if (isFaaoSearchQueryJSON(queryJSON)) {
        return FaaoSearchQuery.fromJSON(queryJSON);
    }
    throw new Error("Unknown query json");
};
