// MIT © 2017 azu
import { GitHubSearchQueryColor } from "./GitHubSearchQueryColor";
import { GitHubSetting } from "../../GitHubSetting/GitHubSetting";
import { EntityId } from "../../util/EntityId";

const execall = require('execall');

export interface GitHubSearchQueryJSON {
    name: string;
    query: string;
    color: string;
    apiHost: string;
    gitHubSettingId: string;
}

export interface GitHubSearchQueryArgs {
    name: string;
    query: string;
    color: GitHubSearchQueryColor;
    apiHost: string;
    gitHubSettingId: EntityId<GitHubSetting>
}

export class GitHubSearchQuery {
    name: string;
    query: string;
    color: GitHubSearchQueryColor;
    apiHost: string;
    gitHubSettingId: EntityId<GitHubSetting>;

    constructor(object: GitHubSearchQueryArgs) {
        this.name = object.name;
        this.query = object.query;
        this.color = object.color;
        this.apiHost = object.apiHost;
        this.gitHubSettingId = object.gitHubSettingId;
    }

    /**
     * if it contains `repo:xxx`, return [xxx]
     * @returns {any}
     */
    get targetRepositories(): string[] {
        const repoPattern = /repo:([^\s]+)/i;
        let results: string[] = [];
        execall(repoPattern, this.query).map((result: any) => {
            results = results.concat(result.sub);
        });
        return results
    }

    /**
     * unique hash value
     * @returns {string}
     */
    get hash() {
        return `${this.name}-${this.query}-${String(this.gitHubSettingId)}`;
    }
}