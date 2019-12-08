import { Identifier } from "../../Entity";
import { GitHubSetting } from "../../GitHubSetting/GitHubSetting";
import { GitHubSearchQuery, GitHubSearchQueryJSON } from "./GitHubSearchQuery";
import { FaaoSearchQuery, FaaoSearchQueryJSON } from "./FaaoSearchQuery";

export type UnionQuery = FaaoSearchQuery | GitHubSearchQuery;
export type UnionQueryJSON = FaaoSearchQueryJSON | GitHubSearchQueryJSON;

export type QueryRole = {
    name: string;
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
