import {
    gitHubSettingRepository,
    GitHubSettingRepository
} from "../../infra/repository/GitHubSettingsRepository";
import {
    gitHubSearchStreamRepository,
    GitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { createSearchQueryToUpdateStreamUseCase } from "./SearchQueryToUpdateStreamUseCase";
import { GitHubSearchStreamFactory } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStreamFactory";
import { GitHubSearchList } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchList";
import { UseCase } from "almin";

const debug = require("debug")("faao:SearchQueriesAndUpdateStreamUseCase");
export const createSearchQueriesAndUpdateStreamUseCase = () => {
    return new SearchQueriesAndUpdateStreamUseCase(
        gitHubSettingRepository,
        gitHubSearchStreamRepository
    );
};

export class SearchQueriesAndUpdateStreamUseCase extends UseCase {
    constructor(
        protected gitHubSettingRepository: GitHubSettingRepository,
        protected gitHubSearchStreamRepository: GitHubSearchStreamRepository
    ) {
        super();
    }

    async execute(searchList: GitHubSearchList) {
        const searchListStream =
            this.gitHubSearchStreamRepository.findBySearchList(searchList) ||
            GitHubSearchStreamFactory.create();
        // save current streamForSearchList
        await this.gitHubSearchStreamRepository.saveWithSearchList(searchListStream, searchList);
        // AppUser open streamForSearchList and select first item
        const promises = searchList.queries.map(query => {
            // Update each stream
            const queryStream =
                this.gitHubSearchStreamRepository.findByQuery(query) ||
                GitHubSearchStreamFactory.create();
            return this.context
                .useCase(createSearchQueryToUpdateStreamUseCase())
                .executor(useCase => {
                    return useCase.execute(query, queryStream);
                })
                .then(() => {
                    // merge updated query stream to searchList stream.
                    debug(`Complete: ${query.name}. To merge searchListStream`);
                    searchListStream.mergeStream(queryStream);
                    this.gitHubSearchStreamRepository.saveWithSearchList(
                        searchListStream,
                        searchList
                    );
                });
        });
        return Promise.all(promises);
    }
}
