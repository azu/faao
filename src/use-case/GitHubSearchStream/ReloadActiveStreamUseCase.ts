// MIT © 2017 azu
import { UseCase } from "almin";
import { AppRepository, appRepository } from "../../infra/repository/AppRepository";
import { createSearchGitHubAbstractUseCase } from "../GitHubSearchList/SearchQueryToUpdateStreamUseCase";
import { createShowErrorNoticeUseCase } from "../Notice/ShowErrorNoticeUseCase";
import { SearchQueryErrorNotice } from "../../domain/Notice/SearchQueryErrorNotice";
import { GitHubSearchList } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchList";

export const createReloadActiveStreamUseCase = () => {
    return new ReloadActiveStreamUseCase(appRepository);
};

export class ReloadActiveStreamUseCase extends UseCase {
    constructor(public appRepository: AppRepository) {
        super();
    }

    async execute() {
        const app = this.appRepository.get();
        const activeQuery = app.user.activity.activeQuery;
        const activeStream = app.user.activity.activeStream;
        if (!activeQuery || !activeStream) {
            return;
        }
        if (activeQuery instanceof GitHubSearchList) {
            console.warn("TODO: activeQuery");
        } else {
            return this.context
                .useCase(createSearchGitHubAbstractUseCase())
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
