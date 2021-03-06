import { UseCase } from "almin";
import { FaaoSearchQueryParam } from "../../domain/GitHubSearchList/queries/FaaoSearchQueryParam";
import { FaaoSearchQuery } from "../../domain/GitHubSearchList/queries/FaaoSearchQuery";
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
        const newSearchList = searchList.replaceQuery(query, newQuery);
        return this.gitHubSearchListRepository.save(newSearchList);
    }
}
