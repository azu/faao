// MIT © 2017 azu
import { UseCase } from "almin";
import {
    gitHubSettingRepository,
    GitHubSettingRepository
} from "../../infra/repository/GitHubSettingsRepository";
import { GitHubSetting, GitHubSettingJSON } from "../../domain/GitHubSetting/GitHubSetting";
import { Identifier } from "../../domain/Entity";
import { GitHubClient } from "../../infra/api/GitHubClient";
import {
    gitHubUserRepository,
    GitHubUserRepository
} from "../../infra/repository/GitHubUserRepository";
import { GitHubUserFactory } from "../../domain/GitHubUser/GitHubUserFactory";

export const createSaveGitHubSettingUseCase = () => {
    return new SaveGitHubSettingUseCase(gitHubSettingRepository, gitHubUserRepository);
};

/**
 * Add GitHub setting or Update setting
 */
export class SaveGitHubSettingUseCase extends UseCase {
    constructor(
        private gitHubSettingRepository: GitHubSettingRepository,
        private gitHubUserRepository: GitHubUserRepository
    ) {
        super();
    }

    async execute(settingJSON: GitHubSettingJSON, id?: Identifier<GitHubSetting>) {
        const setting = GitHubSetting.fromJSON(settingJSON);
        const gitHub = new GitHubClient(setting);
        try {
            const user =
                this.gitHubUserRepository.findById(setting.gitHubUserId) ||
                GitHubUserFactory.create();
            const profile = await gitHub.userProfile();
            user.updateProfile(profile);
            await this.gitHubUserRepository.save(user);
            setting.gitHubUserId = user.id;
        } catch (error) {
            throw new Error(
                "Can't access GitHub API by the setting:" + JSON.stringify(settingJSON)
            );
        }
        if (!id) {
            // add
            this.gitHubSettingRepository.save(setting);
            return;
        }
        // update
        const resolvedGitHubSettingRepository = await this.gitHubSettingRepository.ready();
        const savedSetting = resolvedGitHubSettingRepository.findGitHubSettingById(id);
        if (savedSetting) {
            return this.gitHubSettingRepository.replace(savedSetting, setting);
        }
    }
}
