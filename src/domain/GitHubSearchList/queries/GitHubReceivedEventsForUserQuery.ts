import { Identifier } from "../../Entity";
import { GitHubSetting } from "../../GitHubSetting/GitHubSetting";
import { isQueryRoleJSON, QueryRole, QueryRoleJSON } from "./QueryRole";
import { QueryColor } from "./QueryColor";
import { GitHubETag } from "./GitHubETag";
import { GitHubReceivedEventsForUserQueryParameter } from "./GitHubReceivedEventsForUserQueryParameter";

export type GitHubReceivedEventsForUserQueryJSON = {
    query: string;
    eTag?: ReturnType<typeof GitHubETag.prototype.toJSON>;
} & QueryRoleJSON;

export interface GitHubReceivedEventsForUserQueryArgs {
    name: string;
    query: GitHubReceivedEventsForUserQueryParameter;
    color: QueryColor;
    gitHubSettingId: Identifier<GitHubSetting>;
    eTag: GitHubETag;
}

export const isGitHubReceivedEventsForUserQuery = (
    query: any
): query is GitHubReceivedEventsForUserQuery => {
    return query instanceof GitHubReceivedEventsForUserQuery;
};

export const isGitHubReceivedEventsForUserQueryJSON = (
    query: any
): query is GitHubReceivedEventsForUserQueryJSON => {
    return isQueryRoleJSON(query) && query.query && query.query.startsWith("@@Events");
};

/**
 * Notification Query
 */
export class GitHubReceivedEventsForUserQuery implements QueryRole {
    readonly name: string;
    readonly query: GitHubReceivedEventsForUserQueryParameter;
    readonly color: QueryColor;
    readonly eTag: GitHubETag;
    readonly gitHubSettingId: Identifier<GitHubSetting>;

    constructor(args: GitHubReceivedEventsForUserQueryArgs) {
        this.name = args.name;
        this.query = args.query;
        this.color = args.color;
        this.eTag = args.eTag;
        this.gitHubSettingId = args.gitHubSettingId;
    }

    /**
     * unique hash value
     * @returns {string}
     */
    get hash() {
        return `GitHubReceivedEventsForUserQuery-${this.query}-${this.gitHubSettingId.toValue()}`;
    }

    equals(aQuery?: { hash: string }): boolean {
        if (aQuery === undefined) {
            return false;
        }
        return aQuery.hash === this.hash;
    }

    static fromJSON(json: GitHubReceivedEventsForUserQueryJSON): GitHubReceivedEventsForUserQuery {
        return new GitHubReceivedEventsForUserQuery({
            ...json,
            query: new GitHubReceivedEventsForUserQueryParameter(json.query),
            color: QueryColor.createFromHexCode(json.color),
            gitHubSettingId: new Identifier<GitHubSetting>(json.gitHubSettingId),
            eTag: json.eTag ? GitHubETag.fromJSON(json.eTag) : new GitHubETag()
        });
    }

    toJSON(): GitHubReceivedEventsForUserQueryJSON {
        return {
            ...this,
            query: this.query.toValue(),
            color: this.color.hexCode,
            gitHubSettingId: this.gitHubSettingId.toValue(),
            eTag: this.eTag.toJSON()
        };
    }

    refreshQueryWithETag(eTag: GitHubETag) {
        return new GitHubReceivedEventsForUserQuery({
            ...this,
            eTag: eTag
        });
    }
}
