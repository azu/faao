// MIT © 2017 azu
import { UseCase } from "almin";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import { GitHubSearchList } from "../../domain/GitHubSearchList/GitHubSearchList";
import {
    gitHubSearchListRepository,
    GitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";
import {
    GitHubSearchStreamRepository,
    gitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { isUnionQuery, UnionQuery } from "../../domain/GitHubSearchList/queries/QueryRole";

export const createAppUserOpenStreamUseCase = () => {
    return new AppUserOpenStreamUseCase(
        appRepository,
        gitHubSearchListRepository,
        gitHubSearchStreamRepository
    );
};

export class AppUserOpenStreamUseCase extends UseCase {
    constructor(
        private appRepository: AppRepository,
        private gitHubSearchListRepository: GitHubSearchListRepository,
        public gitHubSearchStreamRepository: GitHubSearchStreamRepository
    ) {
        super();
    }

    execute(query: UnionQuery | GitHubSearchList) {
        const app = this.appRepository.get();
        if (isUnionQuery(query)) {
            const searchList = this.gitHubSearchListRepository.findByQuery(query);
            if (!searchList) {
                throw new Error(`Not Found SearchList for query: ${query.name}`);
            }
            app.user.openQuery(searchList, query);
            const stream = this.gitHubSearchStreamRepository.findByQuery(query);
            if (stream) {
                app.user.openStream(stream);
            }
        } else {
            // open searchList
            app.user.openSearchListSelf(query);
            const stream = this.gitHubSearchStreamRepository.findBySearchList(query);
            if (stream) {
                app.user.openStream(stream);
            }
        }
        return this.appRepository.save(app);
    }
}
