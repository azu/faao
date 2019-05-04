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
        await this.context.useCase(createAppUserOpenStreamUseCase()).execute(searchList);
        await this.context.useCase(createAppUserSelectFirstItemUseCase()).execute();
        const promises = searchList.queries.map(query => {
            // Update each stream
            return this.context
                .useCase(createSearchQueryToUpdateStreamUseCase())
                .execute(query)
                .then(() => {
                    // merge updated query stream to searchList stream.
                    debug(`Complete: ${query.name}. To merge searchListStream`);
                    const stream = this.gitHubSearchStreamRepository.findByQuery(query);
                    const searchListStream = this.gitHubSearchStreamRepository.findBySearchList(
                        searchList
                    );
                    if (!searchListStream) {
                        throw new Error("SearchListStream is deleted accidentally!");
                    }
                    if (!stream) {
                        throw new Error("Stream is deleted accidentally!");
                    }
                    const newStream = searchListStream.mergeStream(stream);
                    return this.gitHubSearchStreamRepository.saveWithSearchList(
                        newStream,
                        searchList.id
                    );
                });
        });
        return Promise.all(promises);
    }
}
