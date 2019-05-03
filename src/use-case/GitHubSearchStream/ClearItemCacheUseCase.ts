import { UseCase } from "almin";
import { FaaoSearchQueryParam } from "../../domain/GitHubSearchList/FaaoSearchQueryParam";
import { FaaoSearchQuery } from "../../domain/GitHubSearchList/FaaoSearchQuery";
import {
    GitHubSearchListRepository,
    gitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";
import {
    GitHubSearchStreamRepository,
    gitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { createReloadActiveStreamUseCase } from "../GitHubSearchStream/ReloadActiveStreamUseCase";

export const createClearItemCacheUseCase = () => {
    return new ClearItemCacheUseCase(gitHubSearchListRepository, gitHubSearchStreamRepository);
};

export type ClearItemCacheUseCaseParam = {
    url: string;
};

export class ClearItemCacheUseCase extends UseCase {
    constructor(
        private gitHubSearchListRepository: GitHubSearchListRepository,
        private gitHubSearchStreamRepository: GitHubSearchStreamRepository
    ) {
        super();
    }

    async execute(param: ClearItemCacheUseCaseParam, query: FaaoSearchQuery) {
        const searchList = this.gitHubSearchListRepository.findByQuery(query);
        if (!searchList) {
            return;
        }
        // update query
        const shouldDelete = query.includesParameterURL(param.url);
        const newQuery = shouldDelete
            ? query.removeParam(new FaaoSearchQueryParam(param))
            : query.addParam(new FaaoSearchQueryParam(param));
        searchList.replaceQuery(query, newQuery);
        await this.gitHubSearchListRepository.save(searchList);
        // update stream - remove cache
        if (!shouldDelete) {
            return;
        }
        // refresh
        return this.context.useCase(createReloadActiveStreamUseCase()).execute();
    }
}
