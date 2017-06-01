// MIT © 2017 azu
import { GitHubSetting } from "./GitHubSetting";

export interface GitHubSettingsArgs {
    settingList: GitHubSetting[];
}

let id = 0;

export class GitHubSettings {
    id: string;
    settingList: GitHubSetting[];

    constructor(args: GitHubSettingsArgs) {
        this.id = `GitHubSettings${id++}`;
        this.settingList = args.settingList;
    }

    findGitHubSettingById(id: string): GitHubSetting | undefined {
        return this.settingList.find(setting => {
            return setting.id.toValue() === id;
        });
    }
}