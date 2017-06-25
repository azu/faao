// MIT © 2017 azu
import { UseCase } from "almin";
import { createSearchQueryToUpdateStreamUseCase } from "../GitHubSearchList/SearchQueryToUpdateStreamUseCase";
import {
    gitHubSearchStreamRepository,
    GitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import {
    gitHubSearchListRepository,
    GitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";

export const createReloadAllStreamUseCase = () => {
    return new ReloadAllStreamUseCase({
        gitHubSearchStreamRepository,
        gitHubSearchListRepository
    });
};

/**
 * Reload all stream
 */
export class ReloadAllStreamUseCase extends UseCase {
    constructor(
        private args: {
            gitHubSearchStreamRepository: GitHubSearchStreamRepository;
            gitHubSearchListRepository: GitHubSearchListRepository;
        }
    ) {
        super();
    }

    async execute() {
        const gitHubSearchLists = this.args.gitHubSearchListRepository.findAll();
        const allQueries: GitHubSearchQuery[] = gitHubSearchLists.reduce(
            (queries: GitHubSearchQuery[], gitHubSearchList) => {
                return queries.concat(gitHubSearchList.queries);
            },
            []
        );
        const promises: Promise<void>[] = allQueries.map(query => {
            const stream = this.args.gitHubSearchStreamRepository.findByQuery(query);
            if (!stream) {
                return;
            }
            return this.context
                .useCase(createSearchQueryToUpdateStreamUseCase())
                .executor(useCase => {
                    return useCase.execute(query, stream);
                });
        });
        return Promise.all(promises);
    }
}
