// MIT © 2017 azu
import { UseCase } from "almin";
import {
    GitHubSearchStreamRepository,
    gitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { AppRepository, appRepository } from "../../infra/repository/AppRepository";
import { SearchFilterFactory } from "../../domain/GitHubSearch/GitHubSearchStream/SearchFilter/SearchFilterFactory";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";

export const createApplyFilterToStreamUseCase = () => {
    return new ApplyFilterToStreamUseCase(appRepository, gitHubSearchStreamRepository);
};

export class ApplyFilterToStreamUseCase extends UseCase {
    constructor(
        public appRepository: AppRepository,
        public gitHubSearchStreamRepository: GitHubSearchStreamRepository
    ) {
        super();
    }

    execute(filterWord: string) {
        const app = this.appRepository.get();
        const activeQuery = app.user.activity.activeQuery;
        const activeStream = app.user.activity.activeStream;
        if (!activeQuery || !activeStream) {
            return;
        }
        const filters = SearchFilterFactory.create(filterWord);
        activeStream.setFilters(filters);
        if (activeQuery instanceof GitHubSearchQuery) {
            return this.gitHubSearchStreamRepository.saveWithQuery(activeStream, activeQuery);
        } else {
            return this.gitHubSearchStreamRepository.saveWithSearchList(activeStream, activeQuery);
        }
    }
}
