import { Identifier } from "../Entity";
import { GitHubSetting } from "../GitHubSetting/GitHubSetting";

export type QueryRole = {
    name: string;
    gitHubSettingId: Identifier<GitHubSetting>;
    hash: string;
    equals(aQuery?: QueryRole): boolean;
    toJSON(): any;
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
