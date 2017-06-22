// MIT © 2017 azu
import { UseCase } from "almin";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import { GitHubSearchStream } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchList } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchList";
import {
    gitHubSearchListRepository,
    GitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";

export const createAppUserOpenStreamUseCase = () => {
    return new AppUserOpenStreamUseCase(appRepository, gitHubSearchListRepository);
};

export class AppUserOpenStreamUseCase extends UseCase {
    constructor(
        private appRepository: AppRepository,
        private gitHubSearchListRepository: GitHubSearchListRepository
    ) {
        super();
    }

    execute(query: GitHubSearchQuery | GitHubSearchList, stream: GitHubSearchStream) {
        const app = this.appRepository.get();
        if (GitHubSearchQuery.isQuery(query)) {
            const searchList = this.gitHubSearchListRepository.findByQuery(query);
            if (!searchList) {
                throw new Error(`Not Found SearchList for query: ${query.name}`);
            }
            app.user.openQuery(searchList, query);
        } else {
            // open searchList
            app.user.openSearchListSelf(query);
        }
        app.user.openStream(stream);
        return this.appRepository.save(app);
    }
}
