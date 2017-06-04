import { UseCase, ChangedPayload } from "almin";
import { GitHubClient } from "../../infra/api/GitHubClient";
import { gitHubSettingRepository, GitHubSettingRepository } from "../../infra/repository/GitHubSettingsRepository";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import {
    gitHubSearchStreamRepository,
    GitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { GitHubSearchStreamFactory } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStreamFactory";
import { GitHubSearchResult } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResult";
import { createAppUserOpenStreamUseCase } from "../App/AppUserOpenStreamUseCase";
import { createAppUserSelectFirstItemUseCase } from "../App/AppUserSelectFirstItemUseCase";
import { EntityId } from "../../domain/util/EntityId";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";

export const createSearchGitHubUseCase = () => {
    return new SearchGitHubUseCase(gitHubSettingRepository, gitHubSearchStreamRepository);
};

export class SearchGitHubUseCase extends UseCase {
    constructor(private gitHubSettingRepository: GitHubSettingRepository,
                private gitHubSearchStreamRepository: GitHubSearchStreamRepository) {
        super();
    }

    async execute(query: GitHubSearchQuery) {
        // const gitHubSetting = this.gitHubSettingRepository.findGitHubSettingById(
        //     query.gitHubSettingId
        // );
        // TODO: use find | current use default setting
        const gitHubSetting = this.gitHubSettingRepository.get();
        if (!gitHubSetting) {
            return Promise.reject(new Error(`Not found GitHubSetting`));
        }
        const stream = await gitHubSearchStreamRepository.findByQuery(query) || GitHubSearchStreamFactory.create();
        // save current stream
        await gitHubSearchStreamRepository.saveWithQuery(stream, query);
        // start fetch
        const gitHubClient = new GitHubClient(gitHubSetting);
        // AppUser open stream and select first item
        await this.context.useCase(createAppUserOpenStreamUseCase())
            .executor(useCase => useCase.execute(stream));
        await this.context.useCase(createAppUserSelectFirstItemUseCase())
            .executor(useCase => useCase.execute());
        return new Promise((resolve, reject) => {
            gitHubClient.search(query, async (result: GitHubSearchResult) => {
                console.log("Progress", result);
                const continueToNext = !stream.alreadyHasResult(result);
                console.log("continueToNext", continueToNext);
                stream.mergeResult(result);
                // save current stream
                await gitHubSearchStreamRepository.saveWithQuery(stream, query);
                // refresh view
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