import { Identifier } from "../../Entity";
import { GitHubSetting } from "../../GitHubSetting/GitHubSetting";
import { GitHubSearchQuery, GitHubSearchQueryJSON, isGitHubSearchQuery } from "./GitHubSearchQuery";
import { FaaoSearchQuery, FaaoSearchQueryJSON, isFaaoSearchQuery } from "./FaaoSearchQuery";
import {
    GitHubNotificationQuery,
    GitHubNotificationQueryJSON,
    isGitHubNotificationQuery
} from "./GitHubNotificationQuery";
import { QueryColor } from "./QueryColor";
import {
    GitHubReceivedEventsForUserQuery,
    GitHubReceivedEventsForUserQueryJSON,
    isGitHubReceivedEventsForUserQuery
} from "./GitHubReceivedEventsForUserQuery";

// See Factory
// QueryService.ts
export type UnionQuery =
    | FaaoSearchQuery
    | GitHubSearchQuery
    | GitHubNotificationQuery
    | GitHubReceivedEventsForUserQuery;
export type UnionQueryJSON =
    | FaaoSearchQueryJSON
    | GitHubSearchQueryJSON
    | GitHubNotificationQueryJSON
    | GitHubReceivedEventsForUserQueryJSON;

export const isUnionQuery = (entity: any): entity is UnionQuery => {
    return (
        isFaaoSearchQuery(entity) ||
        isGitHubSearchQuery(entity) ||
        isGitHubNotificationQuery(entity) ||
        isGitHubReceivedEventsForUserQuery(entity)
    );
};
export type QueryRole = {
    name: string;
    color: QueryColor;
    gitHubSettingId: Identifier<GitHubSetting>;
    hash: string;
    equals(aQuery?: QueryRole): boolean;
    toJSON(): QueryRoleJSON;
};

export type QueryRoleJSON = {
    name: string;
    color: string;
    gitHubSettingId: string;
} & {
    [index: string]: any;
};

export const isQueryRoleJSON = (json: any): json is QueryRoleJSON => {
    return json && json.name && json.color && json.gitHubSettingId;
};
