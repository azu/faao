// MIT © 2017 azu
import { GitHubSearchList } from "./GitHubSearchList";

export class GitHubSearchListFactory {
    static create() {
        return new GitHubSearchList({
            name: "Queries",
            queries: []
        });
    }
}
