// MIT © 2017 azu
import { UseCase } from "almin";
import {
    gitHubSettingRepository,
    GitHubSettingRepository
} from "../../infra/repository/GitHubSettingsRepository";
import { GitHubSetting, GitHubSettingJSON } from "../../domain/GitHubSetting/GitHubSetting";
import { EntityId } from "../../domain/Entity";
import { GitHubClient } from "../../infra/api/GitHubClient";

export const createSaveGitHubSettingUseCase = () => {
    return new SaveGitHubSettingUseCase(gitHubSettingRepository);
};

/**
 * Add GitHub setting or Update setting
 */
export class SaveGitHubSettingUseCase extends UseCase {
    constructor(public gitHubSettingRepository: GitHubSettingRepository) {
        super();
    }

    async execute(settingJSON: GitHubSettingJSON, id?: EntityId<GitHubSetting>) {
        const setting = GitHubSetting.fromJSON(settingJSON);
        const gitHub = new GitHubClient(setting);
        try {
            await gitHub.rateLimits();
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
