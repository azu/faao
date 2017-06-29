// MIT © 2017 azu
import { UseCase } from "almin";
import {
    GitHubSearchListRepository,
    gitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";
import { GitHubSearchQuery } from "../../domain/GitHubSearchList/GitHubSearchQuery";

export const createDeleteQueryUseCase = () => {
    return new DeleteQueryUseCase(gitHubSearchListRepository);
};

export class DeleteQueryUseCase extends UseCase {
    constructor(public gitHubSearchListRepository: GitHubSearchListRepository) {
        super();
    }

    execute(query: GitHubSearchQuery) {
        const searchList = this.gitHubSearchListRepository.findByQuery(query);
        if (!searchList) {
            return;
        }
        searchList.deleteQuery(query);
        return this.gitHubSearchListRepository.save(searchList);
    }
}
