// MIT © 2017 azu
import { Payload, UseCase } from "almin";
import { GitHubClient } from "../../infra/api/GitHubClient";
import {
    GitHubSettingRepository,
    gitHubSettingRepository
} from "../../infra/repository/GitHubSettingsRepository";
import {
    gitHubSearchStreamRepository,
    GitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { GitHubSearchResult } from "../../domain/GitHubSearchStream/GitHubSearchResult";
import { QueryRole } from "../../domain/GitHubSearchList/QueryRole";
import { GitHubSearchStream } from "../../domain/GitHubSearchStream/GitHubSearchStream";
import { createShowOSNoticesUseCase } from "../Notice/ShowOSNoticesUseCase";
import { GitHubSearchStreamFactory } from "../../domain/GitHubSearchStream/GitHubSearchStreamFactory";
import { UnionQuery } from "../../domain/GitHubSearchList/GitHubSearchList";
import { AppRepository, appRepository } from "../../infra/repository/AppRepository";
import { createOSNoticesFromStreams } from "../../domain/GitHubSearchStream/GitHubStreamNoticeFactory";

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
        gitHubSearchStreamRepository,
        appRepository
    );
};

/**
 * It is basic useCase of searching.
 * you can extend this useCase
 * e.g.): before search, open stream
 */
export class SearchQueryToUpdateStreamUseCase extends UseCase {
    constructor(
        private gitHubSettingRepository: GitHubSettingRepository,
        private gitHubSearchStreamRepository: GitHubSearchStreamRepository,
        private appRepository: AppRepository
    ) {
        super();
    }

    async execute(query: QueryRole) {
        const resolvedGitHubSettingRepository = await this.gitHubSettingRepository.ready();
        const gitHubSetting = resolvedGitHubSettingRepository.findGitHubSettingById(
            query.gitHubSettingId
        );
        if (!gitHubSetting) {
            return Promise.reject(
                new Error(
                    `Not found GitHubSetting. Please check the GitHubSetting of the query:${
                        query.name
                    }`
                )
            );
        }
        const gitHubClient = new GitHubClient(gitHubSetting);
        const firstStream = this.gitHubSearchStreamRepository.findByQuery(query);
        let lastStream: undefined | GitHubSearchStream;
        return new Promise((resolve, reject) => {
            this.dispatch(new LoadingStartedPayload());
            gitHubClient.search(
                query,
                async (result: GitHubSearchResult) => {
                    const stream =
                        this.gitHubSearchStreamRepository.findByQuery(query) ||
                        GitHubSearchStreamFactory.create();
                    debug("Searching result", result);
                    const continueToNext = !stream.alreadyHasResult(result);
                    debug("continueToNext", continueToNext);
                    const newStream = stream.mergeResult(result);
                    // save current stream
                    await this.gitHubSearchStreamRepository.saveWithQuery(newStream, query);
                    lastStream = newStream;
                    // refresh view
                    this.dispatch({ type: "ChangedPayload" });
                    return continueToNext;
                },
                async (error: Error) => {
                    console.error(error.message, error.stack);
                    const stream = this.gitHubSearchStreamRepository.findByQuery(query);
                    if (!stream) {
                        throw new Error("stream is not found");
                    }
                    const newStream = stream.clear();
                    await gitHubSearchStreamRepository.saveWithQuery(newStream, query);
                    reject(error);
                },
                () => {
                    debug(`Searching Complete! Query:${query.name}`);
                    const app = this.appRepository.get();
                    const osNotices = createOSNoticesFromStreams({
                        app,
                        query: query as UnionQuery,
                        firstStream: firstStream,
                        lastStream: lastStream
                    });
                    this.context
                        .useCase(createShowOSNoticesUseCase())
                        .execute(osNotices)
                        .then(() => resolve());
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
