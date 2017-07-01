// MIT © 2017 azu
import { UseCase } from "almin";
import {
    GitHubSearchStreamRepository,
    gitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { AppRepository, appRepository } from "../../infra/repository/AppRepository";
import { SearchFilterFactory } from "../../domain/GitHubSearchStream/SearchFilter/SearchFilterFactory";
import { isOpenedGitHubStream } from "../../domain/App/Activity/OpenedGitHubStream";
import { isOpenedGitHubUser } from "../../domain/App/Activity/OpenedGitHubUser";
import {
    gitHubUserRepository,
    GitHubUserRepository
} from "../../infra/repository/GitHubUserRepository";
import { SearchFilter } from "../../domain/GitHubSearchStream/SearchFilter/SearchFilter";

export const createApplyFilterToCurrentContentUseCase = () => {
    return new ApplyFilterToCurrentContentUseCase({
        appRepository,
        gitHubSearchStreamRepository,
        gitHubUserRepository
    });
};

export class ApplyFilterToCurrentContentUseCase extends UseCase {
    constructor(
        private args: {
            appRepository: AppRepository;
            gitHubSearchStreamRepository: GitHubSearchStreamRepository;
            gitHubUserRepository: GitHubUserRepository;
        }
    ) {
        super();
    }

    execute(filterWord: string) {
        const filters = SearchFilterFactory.create(filterWord);
        return this.executeWithFilter(filters);
    }

    private executeWithFilter(filters: SearchFilter): Promise<void> {
        const app = this.args.appRepository.get();
        const openedContent = app.user.activity.openedContent;
        if (!openedContent) {
            return Promise.resolve();
        } else if (isOpenedGitHubStream(openedContent)) {
            const activeStreamId = openedContent.gitHubSearchStreamId;
            const activeStream = this.args.gitHubSearchStreamRepository.findById(activeStreamId);
            if (!activeStream) {
                return Promise.resolve();
            }
            activeStream.setFilters(filters);
            if (app.user.activity.openedSearchListId) {
                return this.args.gitHubSearchStreamRepository.saveWithSearchList(
                    activeStream,
                    app.user.activity.openedSearchListId
                );
            } else if (app.user.activity.openedQuery) {
                return this.args.gitHubSearchStreamRepository.saveWithQuery(
                    activeStream,
                    app.user.activity.openedQuery
                );
            }
            return Promise.resolve();
        } else if (isOpenedGitHubUser(openedContent)) {
            const activeUser = this.args.gitHubUserRepository.findById(openedContent.gitHubUserId);
            if (!activeUser) {
                return Promise.resolve();
            }
            activeUser.activity.applyFilter(filters);
            return this.args.gitHubUserRepository.save(activeUser);
        }
        throw new Error("should not reach");
    }
}
