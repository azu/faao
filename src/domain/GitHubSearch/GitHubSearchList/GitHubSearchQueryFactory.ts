// MIT © 2017 azu
import { GitHubSearchQuery, GitHubSearchQueryJSON } from "./GitHubSearchQuery";
import { GitHubSearchQueryColor } from "./GitHubSearchQueryColor";
import { GitHubSettingFactory } from "../../GitHubSetting/GitHubSettingsFactory";
import { EntityId } from "../../util/EntityId";
import { GitHubSetting } from "../../GitHubSetting/GitHubSetting";

export class GitHubSearchQueryFactory {
    static createFromJSON(json: GitHubSearchQueryJSON) {
        return new GitHubSearchQuery({
            name: json.name,
            query: json.query,
            color: new GitHubSearchQueryColor(json.color),
            gitHubSettingId: new EntityId<GitHubSetting>(json.gitHubSettingId)
        })
    }
}