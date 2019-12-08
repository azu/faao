// MIT © 2017 azu
import { UseCase } from "almin";
import {
    GitHubSearchListRepository,
    gitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";
import { createQueryFromUnionQueryJSON } from "../../domain/GitHubSearchList/queries/QueryService";
import { UnionQuery, UnionQueryJSON } from "../../domain/GitHubSearchList/queries/QueryRole";

export const createUpdateQueryToSearchListUseCase = () => {
    return new UpdateQueryToSearchListUseCase(gitHubSearchListRepository);
};

export class UpdateQueryToSearchListUseCase extends UseCase {
    constructor(public gitHubSearchListRepository: GitHubSearchListRepository) {
        super();
    }

    execute(queryJSON: UnionQueryJSON, editQuery: UnionQuery) {
        const query = createQueryFromUnionQueryJSON(queryJSON);
        const searchList = this.gitHubSearchListRepository.findByQuery(editQuery);
        if (!searchList) {
            return;
        }
        const newSearchList = searchList.replaceQuery(editQuery, query);
        return this.gitHubSearchListRepository.save(newSearchList);
    }
}
