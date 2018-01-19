// MIT © 2017 azu
import { ChangedPayload, Payload, UseCase } from "almin";
import { GitHubClient } from "../../infra/api/GitHubClient";
import { GitHubSettingRepository, gitHubSettingRepository } from "../../infra/repository/GitHubSettingsRepository";
import { GitHubSearchQuery } from "../../domain/GitHubSearchList/GitHubSearchQuery";
import {
    gitHubSearchStreamRepository,
    GitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { GitHubSearchResult } from "../../domain/GitHubSearchStream/GitHubSearchResult";
import { GitHubSearchStream } from "../../domain/GitHubSearchStream/GitHubSearchStream";

const debug = require("debug")("faao:SearchGitHubUseCase");

export class LoadingStartedPayload extends Payload {
    type = "LoadingStatedPayload";
}

export class LoadingFinishedPayload extends Payload {
    type = "LoadingFinishedPayload";
}

export const createSearchQueryToUpdateStreamUseCase = () => {
    return new SearchQueryToUpdateStreamUseCase(
        gitHubSettingRepository,
        gitHubSearchStreamRepository
    );
};

/**
 * It is basic useCase of searching.
 * you can extend this useCase
 * e.g.): before search, open stream
 */
export class SearchQueryToUpdateStreamUseCase extends UseCase {
    constructor(
        protected gitHubSettingRepository: GitHubSettingRepository,
        protected gitHubSearchStreamRepository: GitHubSearchStreamRepository
    ) {
        super();
    }

    async execute(query: GitHubSearchQuery, stream: GitHubSearchStream) {
        const resolvedGitHubSettingRepository = await this.gitHubSettingRepository.ready();
        const gitHubSetting = resolvedGitHubSettingRepository.findGitHubSettingById(
            query.gitHubSettingId
        );
        if (!gitHubSetting) {
            return Promise.reject(
                new Error(
                    `Not found GitHubSetting. Please check the GitHubSetting of the query:${query.name}`
                )
            );
        }
        const gitHubClient = new GitHubClient(gitHubSetting);
        return new Promise((resolve, reject) => {
            this.dispatch(new LoadingStartedPayload());
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
                    debug(`Searching Complete! Query:${query.name}`);
                    resolve();
                }
            );
        }).then(
            () => {
                this.dispatch(new LoadingFinishedPayload());
            },
            error => {
                this.dispatch(new LoadingFinishedPayload());
                return Promise.reject(error);
            }
        );
    }
}
