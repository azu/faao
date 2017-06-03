// MIT © 2017 azu
import { GitHubSearchList } from "./GitHubSearchList";
import { GitHubSearchQuery } from "./GitHubSearchQuery";
import { GitHubSearchQueryColor } from "./GitHubSearchQueryColor";

const defaultQueries = [
    {
        name: "Almin",
        color: "#d1dddc",
        query: "almin",
        apiHost: "https://api.github.com/"
    },
    {
        name: "textlint",
        color: "#dda7d9",
        query: "textlint",
        apiHost: "https://api.github.com/"
    },
    {
        name: "Test",
        color: "#4974af",
        query: "test",
        apiHost: "https://api.github.com/"
    },
    {
        name: "GitHub",
        color: "#000000",
        query: "github in:README.md",
        apiHost: "https://api.github.com/"
    }
];

export class GitHubSearchListFactory {
    static create() {
        const initialQueries = defaultQueries.map(query => {
            return new GitHubSearchQuery({
                name: query.name,
                query: query.query,
                color: new GitHubSearchQueryColor(query.color),
                apiHost: query.apiHost
            })
        });
        return new GitHubSearchList(initialQueries);
    }
}