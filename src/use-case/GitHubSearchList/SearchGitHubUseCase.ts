import { UseCase } from "almin";
import { GitHubClient } from "../../infra/api/GitHubClient";
import { gitHubSettingsRepository, GitHubSettingsRepository } from "../../infra/repository/GitHubSettingsRepository";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";

export const createSearchGitHubUseCase = () => {
    return new SearchGitHubUseCase(gitHubSettingsRepository);
};

export class SearchGitHubUseCase extends UseCase {
    constructor(private gitHubSettingsRepository: GitHubSettingsRepository) {
        super();
    }

    execute(_gitHubSettingId: string, query: GitHubSearchQuery) {
        const gitHubSettings = this.gitHubSettingsRepository.get();
        const gitHubSetting = gitHubSettings.findGitHubSettingById("azu@github.com");
        if (!gitHubSetting) {
            return Promise.reject(new Error(`Not found GitHubSetting: ${_gitHubSettingId}`));
        }
        const gitHubClient = new GitHubClient(gitHubSetting);
        return gitHubClient.search(query);
    }
}