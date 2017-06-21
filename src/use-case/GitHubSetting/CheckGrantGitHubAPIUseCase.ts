// MIT © 2017 azu
import { UseCase } from "almin";
import { GitHubClient } from "../../infra/api/GitHubClient";
import { GitHubSetting, GitHubSettingJSON } from "../../domain/GitHubSetting/GitHubSetting";

export class CheckGrantGitHubAPIUseCase extends UseCase {
    async execute(settingJSON: GitHubSettingJSON) {
        const setting = GitHubSetting.fromJSON(settingJSON);
        const gitHub = new GitHubClient(setting);
        // TODO: check `scopes`
        // https://github.com/philschatz/octokat.js/issues/183
        // Use user api insteadof ratelimit api
        // RateLimit API disable by some GHE. It return 404.
        return gitHub.user();
    }
}
