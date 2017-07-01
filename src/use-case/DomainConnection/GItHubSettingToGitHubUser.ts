// MIT © 2017 azu
import { GitHubSettingRepository } from "../../infra/repository/GitHubSettingsRepository";
import { GitHubUserRepository } from "../../infra/repository/GitHubUserRepository";
import { GitHubUser } from "../../domain/GitHubUser/GitHubUser";
import { Identifier } from "../../domain/Entity";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";

const debug = require("debug")("faao:GItHubSettingToGitHubUser");

export function findGitHubUserByGitHubSettingId(args: {
    gitHubSettingID: Identifier<GitHubSetting>;
    gitHubSettingRepository: GitHubSettingRepository;
    gitHubUserRepository: GitHubUserRepository;
}): GitHubUser | undefined {
    const gitHubSetting = args.gitHubSettingRepository.findById(args.gitHubSettingID);
    if (!gitHubSetting) {
        return debug("Not found gitHubSettingID: %o", args);
    }
    const gitHubUser = args.gitHubUserRepository.findById(gitHubSetting.gitHubUserId);
    if (!gitHubUser) {
        return debug("Not found gitHubUser, gitHubSettingID: %o", args);
    }
    return gitHubUser;
}
