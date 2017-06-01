// MIT © 2017 azu
import { GitHubSearchList } from "./GitHubSearchList";
import { GitHubSearchQuery } from "./GitHubSearchQuery";
import { GitHubSearchQueryColor } from "./GitHubSearchQueryColor";

export class GitHubSearchListFactory {
    static create() {
        const initialQueries = [
            new GitHubSearchQuery({
                name: "てｓｔ",
                color: GitHubSearchQueryColor.createFromHexCode("#000000"),
                query: "test",
                apiHost: "https://api.github.com/"
            })

        ];
        return new GitHubSearchList(initialQueries);
    }
}