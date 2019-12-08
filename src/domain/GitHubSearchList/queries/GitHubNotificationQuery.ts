import { Identifier } from "../../Entity";
import { GitHubSetting } from "../../GitHubSetting/GitHubSetting";
import { isQueryRoleJSON, QueryRole, QueryRoleJSON } from "./QueryRole";
import { QueryColor } from "./QueryColor";
import { SinceDate } from "./SinceDate";

export type GitHubNotificationQueryJSON = {
    query: string;
    sinceDate?: ReturnType<typeof SinceDate.prototype.toJSON>;
} & QueryRoleJSON;

export interface GitHubNotificationQueryArgs {
    name: string;
    query: string;
    color: QueryColor;
    gitHubSettingId: Identifier<GitHubSetting>;
    sinceDate: SinceDate;
}

export const isGitHubNotificationQuery = (query: any): query is GitHubNotificationQuery => {
    return query instanceof GitHubNotificationQuery;
};

export const isGitHubNotificationQueryJSON = (query: any): query is GitHubNotificationQueryJSON => {
    return isQueryRoleJSON(query) && query.query === "@@Notification";
};

/**
 * Notification Query
 */
export class GitHubNotificationQuery implements QueryRole {
    reservationKey: never;
    readonly name: string;
    readonly query: string;
    readonly color: QueryColor;
    readonly sinceDate: SinceDate;
    readonly gitHubSettingId: Identifier<GitHubSetting>;

    constructor(args: GitHubNotificationQueryArgs) {
        this.name = args.name;
        this.query = args.query;
        this.color = args.color;
        this.sinceDate = args.sinceDate;
        this.gitHubSettingId = args.gitHubSettingId;
    }

    /**
     * unique hash value
     * @returns {string}
     */
    get hash() {
        return `GitHubNotificationQuery-${this.name}-${this.gitHubSettingId.toValue()}`;
    }

    equals(aQuery?: { hash: string }): boolean {
        if (aQuery === undefined) {
            return false;
        }
        return aQuery.hash === this.hash;
    }

    static fromJSON(json: GitHubNotificationQueryJSON): GitHubNotificationQuery {
        return new GitHubNotificationQuery({
            ...json,
            color: QueryColor.createFromHexCode(json.color),
            gitHubSettingId: new Identifier<GitHubSetting>(json.gitHubSettingId),
            sinceDate: json.sinceDate ? SinceDate.fromJSON(json.sinceDate) : new SinceDate()
        });
    }

    toJSON(): GitHubNotificationQueryJSON {
        return {
            ...this,
            color: this.color.hexCode,
            gitHubSettingId: this.gitHubSettingId.toValue(),
            sinceDate: this.sinceDate.toJSON()
        };
    }

    refreshQueryAfterSearch() {
        return new GitHubNotificationQuery({
            ...this,
            sinceDate: new SinceDate(Date.now())
        });
    }
}
