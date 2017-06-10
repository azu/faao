// MIT © 2017 azu
import { GitHubSearchQuery, GitHubSearchQueryJSON } from "./GitHubSearchQuery";

export class GitHubSearchQueryFactory {
    static createFromJSON(json: GitHubSearchQueryJSON) {
        return GitHubSearchQuery.fromJSON(json);
    }
}
