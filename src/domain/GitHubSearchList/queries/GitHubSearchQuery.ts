// MIT © 2017 azu
import { QueryColor } from "./QueryColor";
import { Identifier } from "../../Entity";
import { GitHubSetting } from "../../GitHubSetting/GitHubSetting";
import { isQueryRoleJSON, QueryRole, QueryRoleJSON } from "./QueryRole";

const execall = require("execall");

export type GitHubSearchQueryJSON = {
    query: string;
} & QueryRoleJSON;

export interface GitHubSearchQueryArgs {
    name: string;
    query: string;
    color: QueryColor;
    gitHubSettingId: Identifier<GitHubSetting>;
}

export const isGitHubSearchQueryJSON = (query: any): query is GitHubSearchQueryJSON => {
    return isQueryRoleJSON(query) && query.query !== undefined;
};

export const isGitHubSearchQuery = (query: any): query is GitHubSearchQuery => {
    return query instanceof GitHubSearchQuery;
};

export class GitHubSearchQuery implements QueryRole {
    name: string;
    query: string;
    color: QueryColor;
    gitHubSettingId: Identifier<GitHubSetting>;

    static isQuery(v: any): v is GitHubSearchQuery {
        return v instanceof this;
    }

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

    equals(aQuery?: { hash: string }): boolean {
        if (aQuery === undefined) {
            return false;
        }
        return aQuery.hash === this.hash;
    }

    static fromJSON(json: GitHubSearchQueryJSON): GitHubSearchQuery {
        const setting = Object.create(GitHubSearchQuery.prototype);
        return Object.assign(setting, json, {
            color: QueryColor.createFromHexCode(json.color),
            gitHubSettingId: new Identifier<GitHubSetting>(json.gitHubSettingId)
        });
    }

    toJSON() {
        return Object.assign({}, this, {
            color: this.color.hexCode,
            gitHubSettingId: this.gitHubSettingId.toValue()
        });
    }
}
