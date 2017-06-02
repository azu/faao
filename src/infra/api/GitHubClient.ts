// MIT © 2017 azu
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchResult } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResult";
import { GitHubSearchResultFactory } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultFactory";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";
import { Item } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";

const debug = require("debug")("faao:GitHubClient");
const Octokat = require('octokat');

if (!process.env.GH_TOKEN) {
    throw new Error("process.env.GH_TOKEN should be set GitHub Personal token");
}

export class GitHubClient {
    gh: any;

    constructor(gitHubSetting: GitHubSetting) {
        this.gh = new Octokat({
            token: gitHubSetting.token,
            rootURL: gitHubSetting.apiHost
        });
    }

    search(query: GitHubSearchQuery): Promise<GitHubSearchResult> {
        return this.gh.search.issues
            .fetch({
                q: query.query,
                sort: "updated", // always updated
                per_page: 100
            })
            .then((response: { items: Item[] }) => {
                debug("response %o", response);
                // Support incompleteResults
                return GitHubSearchResultFactory.create({
                    items: response.items
                });
            });
    }
}