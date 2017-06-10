// MIT © 2017 azu
import { UseCase } from "almin";
import { gitHubSettingRepository, GitHubSettingRepository } from "../../infra/repository/GitHubSettingsRepository";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";

export const createDeleteSettingUseCase = () => {
    return new DeleteSettingUseCase(gitHubSettingRepository);
};

export class DeleteSettingUseCase extends UseCase {
    constructor(public gitHubSettingRepository: GitHubSettingRepository) {
        super();
    }

    execute(setting: GitHubSetting) {
        return this.gitHubSettingRepository.delete(setting);
    }
}
