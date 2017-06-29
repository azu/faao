// MIT © 2017 azu
import { UseCase } from "almin";
import {
    GitHubSearchListRepository,
    gitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";
import { GitHubSearchQueryJSON } from "../../domain/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchQueryFactory } from "../../domain/GitHubSearchList/GitHubSearchQueryFactory";
import { GitHubSearchList } from "../../domain/GitHubSearchList/GitHubSearchList";

export const createSaveQueryToSearchListUseCase = () => {
    return new SaveQueryToSearchListUseCase(gitHubSearchListRepository);
};

export class SaveQueryToSearchListUseCase extends UseCase {
    constructor(public gitHubSearchListRepository: GitHubSearchListRepository) {
        super();
    }

    execute(searchList: GitHubSearchList, queryJSON: GitHubSearchQueryJSON) {
        const query = GitHubSearchQueryFactory.createFromJSON(queryJSON);
        searchList.saveQuery(query);
        return this.gitHubSearchListRepository.save(searchList);
    }
}
