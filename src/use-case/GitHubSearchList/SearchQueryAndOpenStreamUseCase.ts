import {
    gitHubSettingRepository,
    GitHubSettingRepository
} from "../../infra/repository/GitHubSettingsRepository";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import {
    gitHubSearchStreamRepository,
    GitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { createAppUserOpenStreamUseCase } from "../App/AppUserOpenStreamUseCase";
import {
    createSearchQueryToUpdateStreamUseCase,
    SearchQueryToUpdateStreamUseCase
} from "./SearchQueryToUpdateStreamUseCase";
import { GitHubSearchStreamFactory } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStreamFactory";
import { createAppUserSelectFirstItemUseCase } from "../App/AppUserSelectFirstItemUseCase";
import { createShowErrorNoticeUseCase } from "../Notice/ShowErrorNoticeUseCase";
import { SearchQueryErrorNotice } from "../../domain/Notice/SearchQueryErrorNotice";

const debug = require("debug")("faao:SearchGitHubUseCase");
export const createSearchQueryAndOpenStreamUseCase = () => {
    return new SearchQueryAndOpenStreamUseCase(
        gitHubSettingRepository,
        gitHubSearchStreamRepository
    );
};

export class SearchQueryAndOpenStreamUseCase extends SearchQueryToUpdateStreamUseCase {
    constructor(
        protected gitHubSettingRepository: GitHubSettingRepository,
        protected gitHubSearchStreamRepository: GitHubSearchStreamRepository
    ) {
        super(gitHubSettingRepository, gitHubSearchStreamRepository);
    }

    async execute(query: GitHubSearchQuery) {
        const stream =
            gitHubSearchStreamRepository.findByQuery(query) || GitHubSearchStreamFactory.create();
        // save current stream
        await gitHubSearchStreamRepository.saveWithQuery(stream, query);
        // AppUser open stream and select first item
        await this.context
            .useCase(createAppUserOpenStreamUseCase())
            .executor(useCase => useCase.execute(query, stream));
        await this.context
            .useCase(createAppUserSelectFirstItemUseCase())
            .executor(useCase => useCase.execute());
        return this.context
            .useCase(createSearchQueryToUpdateStreamUseCase())
            .executor(useCase => {
                return useCase.execute(query, stream);
            })
            .catch((error: Error) => {
                const notice = new SearchQueryErrorNotice({
                    query,
                    error
                });
                return this.context
                    .useCase(createShowErrorNoticeUseCase())
                    .executor(useCase => useCase.execute(notice));
            });
    }
}
