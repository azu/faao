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
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";

const debug = require("debug")("faao:ReloadAllStreamUseCase");
export const createReloadAllStreamUseCase = () => {
    return new ReloadAllStreamUseCase({
        appRepository,
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
            appRepository: AppRepository;
            gitHubSearchStreamRepository: GitHubSearchStreamRepository;
            gitHubSearchListRepository: GitHubSearchListRepository;
        }
    ) {
        super();
    }

    async execute() {
        const app = this.args.appRepository.get();
        if (app.network.status === "offline") {
            debug("Currently, network is offline. No Auto-update.");
            return;
        }
        const gitHubSearchLists = this.args.gitHubSearchListRepository.findAll();
        const allQueries = gitHubSearchLists.reduce(
            (queries: GitHubSearchQuery[], gitHubSearchList) => {
                return queries.concat(gitHubSearchList.queries);
            },
            []
        );
        debug(
            allQueries.length > 0 ? `Update Queries: ${allQueries.length}` : "No updatable query"
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
