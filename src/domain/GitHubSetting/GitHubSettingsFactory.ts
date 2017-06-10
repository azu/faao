// MIT © 2017 azu
import { GitHubSetting, GitHubSettingJSON } from "./GitHubSetting";
import { EntityId } from "../Entity";

export class GitHubSettingFactory {
    static create() {
        return new GitHubSetting(
            new EntityId<GitHubSetting>("azu@github.com"),
            process.env.GH_TOKEN,
            "https://api.github.com",
            "https://github.com"
        );
    }
}
