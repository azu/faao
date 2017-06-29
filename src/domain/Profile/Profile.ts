// MIT © 2017 azu
import { GitHubSearchList, GitHubSearchListJSON } from "../GitHubSearchList/GitHubSearchList";
import { GitHubSetting, GitHubSettingJSON } from "../GitHubSetting/GitHubSetting";

export interface ProfileJSON {
    GitHubSettings: GitHubSettingJSON[];
    GitHubSearchLists: GitHubSearchListJSON[];
}

export interface ProfileArgs {
    GitHubSettings: GitHubSetting[];
    GitHubSearchLists: GitHubSearchList[];
}

export class Profile {
    GitHubSettings: GitHubSetting[];
    GitHubSearchLists: GitHubSearchList[];

    constructor(args: ProfileArgs) {
        this.GitHubSettings = args.GitHubSettings;
        this.GitHubSearchLists = args.GitHubSearchLists;
    }
}
