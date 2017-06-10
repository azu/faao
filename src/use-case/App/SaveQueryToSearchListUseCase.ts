// MIT © 2017 azu
import { UseCase } from "almin";
import {
    GitHubSearchListRepository,
    gitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";
import { GitHubSearchQueryJSON } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchQueryFactory } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQueryFactory";

export const createSaveQueryToSearchListUseCase = () => {
    return new SaveQueryToSearchListUseCase(gitHubSearchListRepository);
};

export class SaveQueryToSearchListUseCase extends UseCase {
    constructor(public gitHubSearchListRepository: GitHubSearchListRepository) {
        super();
    }

    execute(queryJSON: GitHubSearchQueryJSON) {
        const query = GitHubSearchQueryFactory.createFromJSON(queryJSON);
        const searchList = this.gitHubSearchListRepository.get();
        searchList.saveQuery(query);
        return this.gitHubSearchListRepository.save(searchList);
    }
}
