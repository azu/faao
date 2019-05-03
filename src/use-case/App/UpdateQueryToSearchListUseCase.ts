// MIT © 2017 azu
import { UseCase } from "almin";
import {
    GitHubSearchListRepository,
    gitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";
import { GitHubSearchQuery } from "../../domain/GitHubSearchList/GitHubSearchQuery";
import { UnionQuery, UnionQueryJSON } from "../../domain/GitHubSearchList/GitHubSearchList";
import { createQueryFromUnionQueryJSON } from "../../domain/GitHubSearchList/QueryService";

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
        searchList.replaceQuery(editQuery, query);
        return this.gitHubSearchListRepository.save(searchList);
    }
}
