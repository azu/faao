import { UseCase } from "almin";
import {
    GitHubSearchListRepository,
    gitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";
import { createSearchQueryAndOpenStreamUseCase } from "./SearchQueryAndOpenStreamUseCase";
import { FaaoSearchQueryParam } from "../../domain/GitHubSearchList/FaaoSearchQueryParam";
import { isFaaoSearchQuery } from "../../domain/GitHubSearchList/FaaoSearchQuery";

export const createAddUrlToFaaoQueryUseCase = () => {
    return new AddUrlToFaaoQueryUseCase(gitHubSearchListRepository);
};

/**
 * Register url to Faao query by name
 */
export class AddUrlToFaaoQueryUseCase extends UseCase {
    constructor(public gitHubSearchListRepository: GitHubSearchListRepository) {
        super();
    }

    async execute(url: string, queryName: string, openSearchList = true) {
        const query = this.gitHubSearchListRepository.findQueryByName(queryName);
        if (!query) {
            return;
        }
        if (!isFaaoSearchQuery(query)) {
            return;
        }
        const searchList = this.gitHubSearchListRepository.findByQuery(query);
        if (!searchList) {
            return;
        }
        const newQuery = query.addParam(new FaaoSearchQueryParam({ url }));
        const newSearchList = searchList.replaceQuery(query, newQuery);
        await this.gitHubSearchListRepository.save(newSearchList);
        if (openSearchList) {
            // open saved searchList
            await this.context.useCase(createSearchQueryAndOpenStreamUseCase()).execute(newQuery);
        }
    }
}
