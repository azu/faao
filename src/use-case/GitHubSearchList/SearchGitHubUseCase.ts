import { UseCase, ChangedPayload } from "almin";
import { GitHubClient } from "../../infra/api/GitHubClient";
import { gitHubSettingsRepository, GitHubSettingsRepository } from "../../infra/repository/GitHubSettingsRepository";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import {
    gitHubSearchStreamRepository,
    GitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { GitHubSearchStreamFactory } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStreamFactory";
import { GitHubSearchResult } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResult";
import { createAppUserOpenStreamUseCase } from "../App/AppUserOpenStreamUseCase";

export const createSearchGitHubUseCase = () => {
    return new SearchGitHubUseCase(gitHubSettingsRepository, gitHubSearchStreamRepository);
};

export class SearchGitHubUseCase extends UseCase {
    constructor(private gitHubSettingsRepository: GitHubSettingsRepository,
                private gitHubSearchStreamRepository: GitHubSearchStreamRepository) {
        super();
    }

    async execute(query: GitHubSearchQuery) {
        const gitHubSettings = this.gitHubSettingsRepository.get();
        const gitHubSetting = gitHubSettings.findGitHubSettingById("azu@github.com");
        if (!gitHubSetting) {
            return Promise.reject(new Error(`Not found GitHubSetting`));
        }
        const stream = await gitHubSearchStreamRepository.findByQuery(query) || GitHubSearchStreamFactory.create();
        // save current stream
        await gitHubSearchStreamRepository.saveWithQuery(stream, query);
        // refresh view
        this.dispatch(new ChangedPayload());
        // fetch and save
        const gitHubClient = new GitHubClient(gitHubSetting);
        return new Promise((resolve, reject) => {
            gitHubClient.search(query, async (result: GitHubSearchResult) => {
                console.log("Progress", result);
                const continueToNext = !stream.alreadyHasResult(result);
                console.log("continueToNext", continueToNext);
                stream.mergeResult(result);
                // open stream
                this.context.useCase(createAppUserOpenStreamUseCase()).executor(useCase => useCase.execute(stream));
                // refresh view
                await gitHubSearchStreamRepository.saveWithQuery(stream, query);
                this.dispatch(new ChangedPayload());
                return continueToNext;
            }, async (error: Error) => {
                console.error(error.message);
                stream.clear();
                await gitHubSearchStreamRepository.saveWithQuery(stream, query);
                reject(error);
            }, () => {
                console.log("Complete!");
                resolve();
            })
        });
    }
}