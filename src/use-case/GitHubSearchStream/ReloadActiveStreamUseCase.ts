// MIT © 2017 azu
import { UseCase } from "almin";
import { AppRepository, appRepository } from "../../infra/repository/AppRepository";
import { createSearchGitHubAbstractUseCase } from "../GitHubSearchList/SearchQueryToUpdateStreamUseCase";
import { createShowErrorNoticeUseCase } from "../Notice/ShowErrorNoticeUseCase";
import { SearchQueryErrorNotice } from "../../domain/Notice/SearchQueryErrorNotice";
import { GitHubSearchList } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchList";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { createSearchQueriesAndUpdateStreamUseCase } from "../GitHubSearchList/SearchQueriesAndUpdateStreamUseCase";

export const createReloadActiveStreamUseCase = () => {
    return new ReloadActiveStreamUseCase(appRepository);
};

export class ReloadActiveStreamUseCase extends UseCase {
    constructor(public appRepository: AppRepository) {
        super();
    }

    async execute() {
        const app = this.appRepository.get();
        const activeSearch = app.user.activity.activeSearch;
        const activeStream = app.user.activity.activeStream;
        if (!activeStream) {
            return;
        }
        if (activeSearch instanceof GitHubSearchList) {
            return this.context
                .useCase(createSearchQueriesAndUpdateStreamUseCase())
                .executor(useCase => useCase.execute(activeSearch));
        } else if (activeSearch instanceof GitHubSearchQuery) {
            return this.context
                .useCase(createSearchGitHubAbstractUseCase())
                .executor(useCase => {
                    return useCase.execute(activeSearch, activeStream);
                })
                .catch((error: Error) => {
                    const notice = new SearchQueryErrorNotice({
                        query: activeSearch,
                        error
                    });
                    return this.context
                        .useCase(createShowErrorNoticeUseCase())
                        .executor(useCase => useCase.execute(notice));
                });
        }
    }
}
