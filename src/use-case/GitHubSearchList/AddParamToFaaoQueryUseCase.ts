import { UseCase } from "almin";
import { FaaoSearchQueryParam } from "../../domain/GitHubSearchList/FaaoSearchQueryParam";
import { FaaoSearchQuery } from "../../domain/GitHubSearchList/FaaoSearchQuery";
import {
    GitHubSearchListRepository,
    gitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";

export const createAddParamToFaaoQueryUseCase = () => {
    return new AddParamToFaaoQueryUseCase(gitHubSearchListRepository);
};

export type AddParamToFaaoQueryUseCaseParam = {
    url: string;
};

export class AddParamToFaaoQueryUseCase extends UseCase {
    constructor(public gitHubSearchListRepository: GitHubSearchListRepository) {
        super();
    }

    execute(param: AddParamToFaaoQueryUseCaseParam, query: FaaoSearchQuery): any {
        const searchList = this.gitHubSearchListRepository.findByQuery(query);
        if (!searchList) {
            return;
        }
        const newQuery = query.addParam(new FaaoSearchQueryParam(param));
        searchList.replaceQuery(query, newQuery);
        return this.gitHubSearchListRepository.save(searchList);
    }
}
