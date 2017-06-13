// MIT © 2017 azu
import { UseCase } from "almin";
import {
    GitHubSearchListRepository,
    gitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";
import {
    GitHubSearchQuery,
    GitHubSearchQueryJSON
} from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchQueryFactory } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQueryFactory";

export const createUpdateQueryToSearchListUseCase = () => {
    return new UpdateQueryToSearchListUseCase(gitHubSearchListRepository);
};

export class UpdateQueryToSearchListUseCase extends UseCase {
    constructor(public gitHubSearchListRepository: GitHubSearchListRepository) {
        super();
    }

    execute(queryJSON: GitHubSearchQueryJSON, editQuery: GitHubSearchQuery) {
        const query = GitHubSearchQueryFactory.createFromJSON(queryJSON);
        const searchList = this.gitHubSearchListRepository.findByQuery(query);
        if (!searchList) {
            return;
        }
        searchList.replaceQuery(editQuery, query);
        return this.gitHubSearchListRepository.save(searchList);
    }
}
