// MIT © 2017 azu
import { GitHubSettings } from "./GitHubSettings";
import { GitHubSetting } from "./GitHubSetting";
import { EntityId } from "../util/EntityId";

export class GitHubSettingsFactory {
    static create() {
        const defaultSetting = new GitHubSetting(
            new EntityId<GitHubSetting>("azu@github.com"),
            process.env.GH_TOKEN,
            "https://api.github.com",
            'https://github.com'
        );
        return new GitHubSettings({
            settingList: [defaultSetting]
        });
    }
}