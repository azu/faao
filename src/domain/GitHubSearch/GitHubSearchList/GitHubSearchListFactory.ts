// MIT © 2017 azu
import { GitHubSearchList } from "./GitHubSearchList";
import { GitHubSearchQuery } from "./GitHubSearchQuery";
import { GitHubSearchQueryColor } from "./GitHubSearchQueryColor";
import { GitHubSettingFactory } from "../../GitHubSetting/GitHubSettingsFactory";

const defaultQueries = [
    {
        name: "azu",
        color: "#d2ddb9",
        query: "user:azu involves:azu",
        apiHost: "https://api.github.com/"
    },
    {
        name: "Almin",
        color: "#d1dddc",
        query: "almin",
        apiHost: "https://api.github.com/"
    },
    {
        name: "azu@todo",
        color: "#54dd00",
        query: "repo:azu/azu",
        apiHost: "https://api.github.com/"
    },
    {
        name: "azu/faao",
        color: "#4974af",
        query: "repo:azu/faao",
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
                apiHost: query.apiHost,
                gitHubSettingId: GitHubSettingFactory.create().id // TODO: remove
            })
        });
        return new GitHubSearchList(initialQueries);
    }
}