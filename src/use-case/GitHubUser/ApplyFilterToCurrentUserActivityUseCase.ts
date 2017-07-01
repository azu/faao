// MIT © 2017 azu
import { UseCase } from "almin";
import { AppRepository, appRepository } from "../../infra/repository/AppRepository";
import { SearchFilterFactory } from "../../domain/GitHubSearchStream/SearchFilter/SearchFilterFactory";
import {
    gitHubUserRepository,
    GitHubUserRepository
} from "../../infra/repository/GitHubUserRepository";

export const createApplyFilterToCurrentUserActivityUseCase = () => {
    return new ApplyFilterToCurrentUserActivityUseCase({
        appRepository,
        gitHubUserRepository
    });
};

export class ApplyFilterToCurrentUserActivityUseCase extends UseCase {
    constructor(
        private args: {
            appRepository: AppRepository;
            gitHubUserRepository: GitHubUserRepository;
        }
    ) {
        super();
    }

    execute(filterWord: string) {
        const filters = SearchFilterFactory.create(filterWord);
        const app = this.args.appRepository.get();
        if (!app.user.activity.openedUserId) {
            return;
        }
        const activeUser = this.args.gitHubUserRepository.findById(app.user.activity.openedUserId);
        if (!activeUser) {
            return Promise.resolve();
        }
        activeUser.activity.applyFilter(filters);
        return this.args.gitHubUserRepository.save(activeUser);
    }
}
