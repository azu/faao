// MIT © 2017 azu
import { UseCase } from "almin";
import { GitHubClient } from "../../infra/api/GitHubClient";
import { GitHubSetting, GitHubSettingJSON } from "../../domain/GitHubSetting/GitHubSetting";

export class CheckGrantGitHubAPIUseCase extends UseCase {
    async execute(settingJSON: GitHubSettingJSON) {
        const setting = GitHubSetting.fromJSON(settingJSON);
        const gitHub = new GitHubClient(setting);
        await gitHub.rateLimits();
    }
}
