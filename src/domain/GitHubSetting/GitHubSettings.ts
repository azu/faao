// MIT © 2017 azu
import { GitHubSetting } from "./GitHubSetting";

export interface GitHubSettingsArgs {
    settingList: GitHubSetting[];
}

export class GitHubSettings {
    settingList: GitHubSetting[];

    constructor(args: GitHubSettingsArgs) {
        this.settingList = args.settingList;
    }

    getSettingMatchAPIHost(apiHost: string): GitHubSetting | undefined {
        return this.settingList.find(setting => {
            return setting.apiHost === apiHost;
        });
    }
}