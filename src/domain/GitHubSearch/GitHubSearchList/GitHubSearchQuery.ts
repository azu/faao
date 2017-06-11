// MIT © 2017 azu
import { GitHubSearchQueryColor } from "./GitHubSearchQueryColor";
import { GitHubSetting } from "../../GitHubSetting/GitHubSetting";
import { EntityId } from "../../Entity";

const execall = require("execall");

export interface GitHubSearchQueryJSON {
    name: string;
    query: string;
    color: string;
    gitHubSettingId: string;
}

export interface GitHubSearchQueryArgs {
    name: string;
    query: string;
    color: GitHubSearchQueryColor;
    gitHubSettingId: EntityId<GitHubSetting>;
}

export class GitHubSearchQuery {
    name: string;
    query: string;
    color: GitHubSearchQueryColor;
    gitHubSettingId: EntityId<GitHubSetting>;

    constructor(object: GitHubSearchQueryArgs) {
        this.name = object.name;
        this.query = object.query;
        this.color = object.color;
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
        return results;
    }

    /**
     * unique hash value
     * @returns {string}
     */
    get hash() {
        return `${this.name}-${this.query}-${this.gitHubSettingId.toValue()}`;
    }

    equals(aQuery: GitHubSearchQuery): boolean {
        return aQuery.hash === this.hash;
    }

    static fromJSON(json: GitHubSearchQueryJSON): GitHubSearchQuery {
        const setting = Object.create(GitHubSearchQuery.prototype);
        return Object.assign(setting, json, {
            color: GitHubSearchQueryColor.createFromHexCode(json.color),
            gitHubSettingId: new EntityId<GitHubSetting>(json.gitHubSettingId)
        });
    }

    toJSON() {
        return Object.assign({}, this, {
            color: this.color.hexCode,
            gitHubSettingId: this.gitHubSettingId.toValue()
        });
    }
}
