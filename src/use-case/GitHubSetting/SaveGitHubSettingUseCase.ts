// MIT © 2017 azu
import { UseCase } from "almin";
import { gitHubSettingRepository, GitHubSettingRepository } from "../../infra/repository/GitHubSettingsRepository";
import { GitHubSetting, GitHubSettingJSON } from "../../domain/GitHubSetting/GitHubSetting";
import { GitHubSettingFactory } from "../../domain/GitHubSetting/GitHubSettingsFactory";
import { EntityId } from "../../domain/util/EntityId";

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
