import { UseCase } from "almin";
import { FaaoSearchQueryParam } from "../../domain/GitHubSearchList/queries/FaaoSearchQueryParam";
import { FaaoSearchQuery } from "../../domain/GitHubSearchList/queries/FaaoSearchQuery";
import {
    GitHubSearchListRepository,
    gitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";

export const createDeleteParamToFaaoQueryUseCase = () => {
    return new DeleteParamToFaaoQueryUseCase(gitHubSearchListRepository);
};

export type DeleteParamToFaaoQueryUseCaseParam = {
    url: string;
};

export class DeleteParamToFaaoQueryUseCase extends UseCase {
    constructor(public gitHubSearchListRepository: GitHubSearchListRepository) {
        super();
    }

    execute(param: DeleteParamToFaaoQueryUseCaseParam, query: FaaoSearchQuery): any {
        const searchList = this.gitHubSearchListRepository.findByQuery(query);
        if (!searchList) {
            return;
        }
        const newQuery = query.removeParam(new FaaoSearchQueryParam(param));
        const newSearchList = searchList.replaceQuery(query, newQuery);
        return this.gitHubSearchListRepository.save(newSearchList);
    }
}
