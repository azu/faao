import { Identifier } from "../../Entity";
import { GitHubSetting } from "../../GitHubSetting/GitHubSetting";
import { QueryColor } from "./QueryColor";
import { FaaoSearchQueryParams, FaaoSearchQueryParamsJSON } from "./FaaoSearchQueryParams";
import { isQueryRoleJSON, QueryRole, QueryRoleJSON } from "./QueryRole";
import { FaaoSearchQueryParam } from "./FaaoSearchQueryParam";

export type FaaoSearchQueryJSON = {
    searchParams: FaaoSearchQueryParamsJSON;
} & QueryRoleJSON;

export interface FaaoSearchQueryArgs {
    name: string;
    searchParams: FaaoSearchQueryParams;
    color: QueryColor;
    gitHubSettingId: Identifier<GitHubSetting>;
}

export const isFaaoSearchQuery = (query: any): query is FaaoSearchQuery => {
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
export class FaaoSearchQuery implements QueryRole {
    readonly name: string;
    searchParams: FaaoSearchQueryParams;
    color: QueryColor;
    gitHubSettingId: Identifier<GitHubSetting>;

    constructor(args: FaaoSearchQueryArgs) {
        this.name = args.name;
        this.searchParams = args.searchParams;
        this.color = args.color;
        this.gitHubSettingId = args.gitHubSettingId;
    }

    get hasRequestableSearchParams() {
        return this.searchParams.hasAtLeastOne;
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
            color: QueryColor.createFromHexCode(json.color),
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

    includesParameterURL(url: string) {
        return this.searchParams.includesURL(url);
    }

    addParam(param: FaaoSearchQueryParam) {
        return new FaaoSearchQuery({
            ...this,
            searchParams: this.searchParams.add(param)
        });
    }

    removeParam(param: FaaoSearchQueryParam) {
        return new FaaoSearchQuery({
            ...this,
            searchParams: this.searchParams.remove(param)
        });
    }
}
