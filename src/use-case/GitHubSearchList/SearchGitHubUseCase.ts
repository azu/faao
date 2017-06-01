import { UseCase } from "almin";
import { GitHubClient } from "../../infra/api/GitHubClient";
import { gitHubSettingsRepository, GitHubSettingsRepository } from "../../infra/repository/GitHubSettingsRepository";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import {
    gitHubSearchStreamRepository,
    GitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { GitHubSearchStreamFactory } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStreamFactory";

export const createSearchGitHubUseCase = () => {
    return new SearchGitHubUseCase(gitHubSettingsRepository, gitHubSearchStreamRepository);
};

export class SearchGitHubUseCase extends UseCase {
    constructor(private gitHubSettingsRepository: GitHubSettingsRepository,
                private gitHubSearchStreamRepository: GitHubSearchStreamRepository) {
        super();
    }

    execute(query: GitHubSearchQuery) {
        const gitHubSettings = this.gitHubSettingsRepository.get();
        const gitHubSetting = gitHubSettings.findGitHubSettingById("azu@github.com");
        if (!gitHubSetting) {
            return Promise.reject(new Error(`Not found GitHubSetting`));
        }
        const stream = gitHubSearchStreamRepository.findByQuery(query) || GitHubSearchStreamFactory.create();
        const gitHubClient = new GitHubClient(gitHubSetting);
        return gitHubClient.search(query).then((gitHubSearchResult) => {
            console.log(gitHubSearchResult);
            stream.mergeResult(gitHubSearchResult);
            gitHubSearchStreamRepository.saveWithQuery(stream, query);
        });
    }
}