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

export const createUpdateFaaoQueryParamUseCase = () => {
    return new UpdateFaaoQueryParamUseCase(
        gitHubSearchListRepository,
        gitHubSearchStreamRepository
    );
};

export type UpdateFaaoQueryParamUseCaseParam = {
    url: string;
};

export class UpdateFaaoQueryParamUseCase extends UseCase {
    constructor(
        private gitHubSearchListRepository: GitHubSearchListRepository,
        private gitHubSearchStreamRepository: GitHubSearchStreamRepository
    ) {
        super();
    }

    async execute(param: UpdateFaaoQueryParamUseCaseParam, query: FaaoSearchQuery) {
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
        const stream = this.gitHubSearchStreamRepository.findByQuery(query);
        if (!stream) {
            return;
        }
        const item = stream.itemSortedCollection.findItemByPredicate(
            item => item.html_url === param.url
        );
        if (!item) {
            return;
        }
        const newStream = stream.removeItemFromStream(item);
        await this.gitHubSearchStreamRepository.saveWithQuery(newStream, newQuery);
        // refresh
        return this.context.useCase(createReloadActiveStreamUseCase()).execute();
    }
}
