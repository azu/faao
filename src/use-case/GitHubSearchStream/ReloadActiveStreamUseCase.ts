// MIT © 2017 azu
import { UseCase } from "almin";
import { AppRepository, appRepository } from "../../infra/repository/AppRepository";
import { createSearchQueryToUpdateStreamUseCase } from "../GitHubSearchList/SearchQueryToUpdateStreamUseCase";
import { createShowErrorNoticeUseCase } from "../Notice/ShowErrorNoticeUseCase";
import { SearchQueryErrorNotice } from "../../domain/Notice/SearchQueryErrorNotice";
import { createSearchQueriesAndUpdateStreamUseCase } from "../GitHubSearchList/SearchQueriesAndUpdateStreamUseCase";
import {
    gitHubSearchStreamRepository,
    GitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import {
    gitHubSearchListRepository,
    GitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";

export const createReloadActiveStreamUseCase = () => {
    return new ReloadActiveStreamUseCase(
        appRepository,
        gitHubSearchStreamRepository,
        gitHubSearchListRepository
    );
};

export class ReloadActiveStreamUseCase extends UseCase {
    constructor(
        private appRepository: AppRepository,
        private gitHubSearchStreamRepository: GitHubSearchStreamRepository,
        private gitHubSearchListRepository: GitHubSearchListRepository
    ) {
        super();
    }

    async execute() {
        const app = this.appRepository.get();
        const activeSearchListId = app.user.activity.openedSearchListId;
        const activeQuery = app.user.activity.openedQuery;
        const activeStreamId = app.user.activity.openedStreamId;
        const activeStream = this.gitHubSearchStreamRepository.findById(activeStreamId);
        if (!activeStream) {
            return;
        }
        if (activeSearchListId) {
            const searchList = this.gitHubSearchListRepository.findById(activeSearchListId);
            if (!searchList) {
                return;
            }
            return this.context
                .useCase(createSearchQueriesAndUpdateStreamUseCase())
                .executor(useCase => useCase.execute(searchList));
        } else if (activeQuery) {
            return this.context
                .useCase(createSearchQueryToUpdateStreamUseCase())
                .executor(useCase => {
                    return useCase.execute(activeQuery, activeStream);
                })
                .catch((error: Error) => {
                    const notice = new SearchQueryErrorNotice({
                        query: activeQuery,
                        error
                    });
                    return this.context
                        .useCase(createShowErrorNoticeUseCase())
                        .executor(useCase => useCase.execute(notice));
                });
        }
    }
}
