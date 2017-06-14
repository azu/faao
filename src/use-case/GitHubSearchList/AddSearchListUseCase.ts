// MIT © 2017 azu
import { UseCase } from "almin";
import { GitHubSearchListFactory } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchListFactory";
import {
    gitHubSearchListRepository,
    GitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";

export const createAddSearchListUseCase = () => {
    return new AddSearchListUseCase(gitHubSearchListRepository);
};

export class AddSearchListUseCase extends UseCase {
    constructor(private gitHubSearchListRepository: GitHubSearchListRepository) {
        super();
    }

    execute(name: string) {
        const searchList = GitHubSearchListFactory.create(name);
        this.gitHubSearchListRepository.save(searchList);
    }
}
