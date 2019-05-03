import { Identifier } from "../Entity";
import { GitHubSetting } from "../GitHubSetting/GitHubSetting";
import { GitHubSearchQueryColor } from "./GitHubSearchQueryColor";
import { FaaoSearchQueryParams, FaaoSearchQueryParamsJSON } from "./FaaoSearchQueryParams";
import { isQueryRoleJSON, QueryRole, QueryRoleJSON } from "./QueryRole";

export type FaaoSearchQueryJSON = {
    searchParams: FaaoSearchQueryParamsJSON;
} & QueryRoleJSON;

export interface FaaoSearchQueryArgs {
    name: string;
    searchParams: FaaoSearchQueryParams;
    color: GitHubSearchQueryColor;
    gitHubSettingId: Identifier<GitHubSetting>;
}

export const isFaaoSearchQuery = (query: QueryRole): query is FaaoSearchQuery => {
    return query instanceof FaaoSearchQuery;
};

export const isFaaoSearchQueryJSON = (query: any): query is FaaoSearchQueryJSON => {
    return isQueryRoleJSON(query) && query.searchParams !== undefined;
};

/**
 * Faao specific query.
 * It focus on specific item.
 * Similar with GitHubSearchQuery.
 */
export class FaaoSearchQuery {
    readonly name: string;
    searchParams: FaaoSearchQueryParams;
    color: GitHubSearchQueryColor;
    gitHubSettingId: Identifier<GitHubSetting>;

    constructor(args: FaaoSearchQueryArgs) {
        this.name = args.name;
        this.searchParams = args.searchParams;
        this.color = args.color;
        this.gitHubSettingId = args.gitHubSettingId;
    }

    /**
     * unique hash value
     * @returns {string}
     */
    get hash() {
        return `faao-query-${this.name}-${this.gitHubSettingId.toValue()}`;
    }

    equals(aQuery?: { hash: string }): boolean {
        if (aQuery === undefined) {
            return false;
        }
        return aQuery.hash === this.hash;
    }

    static fromJSON(json: FaaoSearchQueryJSON): FaaoSearchQuery {
        const setting = Object.create(FaaoSearchQuery.prototype);
        return Object.assign(setting, json, {
            color: GitHubSearchQueryColor.createFromHexCode(json.color),
            searchParams: FaaoSearchQueryParams.fromJSON(json.searchParams),
            gitHubSettingId: new Identifier<GitHubSetting>(json.gitHubSettingId)
        });
    }

    toJSON(): FaaoSearchQueryJSON {
        return Object.assign({}, this, {
            name: this.name,
            color: this.color.hexCode,
            gitHubSettingId: this.gitHubSettingId.toValue(),
            searchParams: this.searchParams.toJSON()
        });
    }
}
