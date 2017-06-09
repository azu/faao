// MIT © 2017 azu
import { UseCase, ChangedPayload } from "almin";
import { GitHubClient } from "../../infra/api/GitHubClient";
import { GitHubSettingRepository, gitHubSettingRepository } from "../../infra/repository/GitHubSettingsRepository";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import {
    gitHubSearchStreamRepository,
    GitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { GitHubSearchResult } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResult";
import { GitHubSearchStream } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";

const debug = require("debug")("faao:SearchGitHubUseCase");

export const createSearchGitHubAbstractUseCase = () => {
    return new SearchGitHubAbstractUseCase(gitHubSettingRepository, gitHubSearchStreamRepository);
};

/**
 * It is basic useCase of searching.
 * you can extend this useCase
 * e.g.): before search, open stream
 */
export class SearchGitHubAbstractUseCase extends UseCase {
    constructor(
        protected gitHubSettingRepository: GitHubSettingRepository,
        protected gitHubSearchStreamRepository: GitHubSearchStreamRepository
    ) {
        super();
    }

    async execute(query: GitHubSearchQuery, stream: GitHubSearchStream) {
        const gitHubSetting = await this.gitHubSettingRepository.findGitHubSettingById(query.gitHubSettingId);
        if (!gitHubSetting) {
            return Promise.reject(new Error(`Not found GitHubSetting`));
        }
        const gitHubClient = new GitHubClient(gitHubSetting);
        return new Promise((resolve, reject) => {
            gitHubClient.search(
                query,
                async (result: GitHubSearchResult) => {
                    debug("Searching result", result);
                    const continueToNext = !stream.alreadyHasResult(result);
                    debug("continueToNext", continueToNext);
                    stream.mergeResult(result);
                    // save current stream
                    await this.gitHubSearchStreamRepository.saveWithQuery(stream, query);
                    // refresh view
                    this.dispatch(new ChangedPayload());
                    return continueToNext;
                },
                async (error: Error) => {
                    console.error(error.message, error.stack);
                    stream.clear();
                    await gitHubSearchStreamRepository.saveWithQuery(stream, query);
                    reject(error);
                },
                () => {
                    debug("Searching Complete!");
                    resolve();
                }
            );
        });
    }
}
