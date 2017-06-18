// MIT © 2017 azu
import { UseCase } from "almin";
import {
    GitHubSearchStreamRepository,
    gitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { AppRepository, appRepository } from "../../infra/repository/AppRepository";
import { SearchFilterFactory } from "../../domain/GitHubSearch/GitHubSearchStream/SearchFilter/SearchFilterFactory";

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
        const activeSearchList = app.user.activity.activeSearchList;
        const activeStream = app.user.activity.activeStream;
        if (!activeStream) {
            return;
        }
        const filters = SearchFilterFactory.create(filterWord);
        activeStream.setFilters(filters);
        if (activeSearchList) {
            return this.gitHubSearchStreamRepository.saveWithSearchList(
                activeStream,
                activeSearchList
            );
        } else if (activeQuery) {
            return this.gitHubSearchStreamRepository.saveWithQuery(activeStream, activeQuery);
        } else {
            return;
        }
    }
}
