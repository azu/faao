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
import { OSNotice } from "../../domain/Notice/OSNotice";
import { GitHubSearchStreamFactory } from "../../domain/GitHubSearchStream/GitHubSearchStreamFactory";

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
                    // Notice updated results
                    // First results is ignored
                    if (lastStream && firstStream && firstStream.hasResultAtLeastOne) {
                        const diff = lastStream.itemSortedCollection.differenceCollection(
                            firstStream.itemSortedCollection
                        );
                        const notices = diff.items.map(item => {
                            return new OSNotice({
                                title: item.title,
                                body: item.body,
                                subTitle: item.shortPath,
                                icon: item.user.avatar_url
                            });
                        });
                        this.context
                            .useCase(createShowOSNoticesUseCase())
                            .execute(notices)
                            .then(() => resolve());
                    } else {
                        resolve();
                    }
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
