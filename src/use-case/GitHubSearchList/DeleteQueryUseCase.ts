// MIT © 2017 azu
import { UseCase } from "almin";
import {
    GitHubSearchListRepository,
    gitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";
import { UnionQuery } from "../../domain/GitHubSearchList/GitHubSearchList";

export const createDeleteQueryUseCase = () => {
    return new DeleteQueryUseCase(gitHubSearchListRepository);
};

export class DeleteQueryUseCase extends UseCase {
    constructor(public gitHubSearchListRepository: GitHubSearchListRepository) {
        super();
    }

    execute(query: UnionQuery) {
        const searchList = this.gitHubSearchListRepository.findByQuery(query);
        if (!searchList) {
            return;
        }
        const newSearchList = searchList.deleteQuery(query);
        return this.gitHubSearchListRepository.save(newSearchList);
    }
}
