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
import { createShowErrorNoticeUseCase } from "../Notice/ShowErrorNoticeUseCase";
import { SearchQueryErrorNotice } from "../../domain/Notice/SearchQueryErrorNotice";
import { UseCase } from "almin";
import { UnionQuery } from "../../domain/GitHubSearchList/queries/QueryRole";

export const createSearchQueryAndOpenStreamUseCase = () => {
    return new SearchQueryAndOpenStreamUseCase(
        gitHubSettingRepository,
        gitHubSearchStreamRepository
    );
};

export class SearchQueryAndOpenStreamUseCase extends UseCase {
    constructor(
        private gitHubSettingRepository: GitHubSettingRepository,
        private gitHubSearchStreamRepository: GitHubSearchStreamRepository
    ) {
        super();
    }

    async execute(query: UnionQuery) {
        const stream =
            gitHubSearchStreamRepository.findByQuery(query) || GitHubSearchStreamFactory.create();
        // save current stream
        await gitHubSearchStreamRepository.saveWithQuery(stream, query);
        // AppUser open stream and select first item
        await this.context.useCase(createAppUserOpenStreamUseCase()).execute(query);
        await this.context.useCase(createAppUserSelectFirstItemUseCase()).execute();
        return this.context
            .useCase(createSearchQueryToUpdateStreamUseCase())
            .execute(query)
            .catch((error: Error) => {
                const notice = new SearchQueryErrorNotice({
                    query,
                    error
                });
                return this.context.useCase(createShowErrorNoticeUseCase()).execute(notice);
            });
    }
}
