// MIT © 2017 azu
import { GitHubSearchQueryColor } from "./GitHubSearchQueryColor";
import { GitHubSetting } from "../../GitHubSetting/GitHubSetting";
import { EntityId } from "../../util/EntityId";

export interface GitHubSearchQueryJSON {
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

    constructor(object: GitHubSearchQueryJSON) {
        this.name = object.name;
        this.query = object.query;
        this.color = object.color;
        this.apiHost = object.apiHost;
        this.gitHubSettingId = object.gitHubSettingId;
    }

    /**
     * unique hash value
     * @returns {string}
     */
    get hash() {
        return `${this.name}-${this.query}-${String(this.gitHubSettingId)}`;
    }
}