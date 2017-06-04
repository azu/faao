// MIT © 2017 azu
import { UseCase } from "almin";
import {
    GitHubSearchListRepository,
    gitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";
import { GitHubSearchQueryJSON } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchQueryFactory } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQueryFactory";

export const createAddQueryToSearchListUseCase = () => {
    return new AddQueryToSearchListUseCase(gitHubSearchListRepository);
};

export class AddQueryToSearchListUseCase extends UseCase {
    constructor(public gitHubSearchListRepository: GitHubSearchListRepository) {
        super();
    }

    execute(queryJSON: GitHubSearchQueryJSON) {
        const query = GitHubSearchQueryFactory.createFromJSON(queryJSON);
        const searchList = this.gitHubSearchListRepository.get();
        searchList.addQuery(query);
        this.gitHubSearchListRepository.save(searchList);
    }
}