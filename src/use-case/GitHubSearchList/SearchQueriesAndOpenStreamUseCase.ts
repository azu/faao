import {
    gitHubSettingRepository,
    GitHubSettingRepository
} from "../../infra/repository/GitHubSettingsRepository";
import {
    gitHubSearchStreamRepository,
    GitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { createAppUserOpenStreamUseCase } from "../App/AppUserOpenStreamUseCase";
import { createSearchQueryToUpdateStreamUseCase } from "./SearchQueryToUpdateStreamUseCase";
import { GitHubSearchStreamFactory } from "../../domain/GitHubSearchStream/GitHubSearchStreamFactory";
import { createAppUserSelectFirstItemUseCase } from "../App/AppUserSelectFirstItemUseCase";
import { GitHubSearchList } from "../../domain/GitHubSearchList/GitHubSearchList";
import { UseCase } from "almin";

const debug = require("debug")("faao:SearchQueriesAndOpenStreamUseCase");
export const createSearchQueriesAndOpenStreamUseCase = () => {
    return new SearchQueriesAndOpenStreamUseCase(
        gitHubSettingRepository,
        gitHubSearchStreamRepository
    );
};

export class SearchQueriesAndOpenStreamUseCase extends UseCase {
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
        await this.gitHubSearchStreamRepository.saveWithSearchList(searchListStream, searchList.id);
        // AppUser open streamForSearchList and select first item
        await this.context
            .useCase(createAppUserOpenStreamUseCase())
            .executor(useCase => useCase.execute(searchList, searchListStream));
        await this.context
            .useCase(createAppUserSelectFirstItemUseCase())
            .executor(useCase => useCase.execute());
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
                    return this.gitHubSearchStreamRepository.saveWithSearchList(
                        searchListStream,
                        searchList.id
                    );
                });
        });
        return Promise.all(promises);
    }
}
