// MIT © 2017 azu
import { UseCase } from "almin";
import { GitHubSearchResultItem } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import {
    GitHubSearchStreamRepository,
    gitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { createAppUserSelectItemUseCase } from "./AppUserSelectItemUseCase";

export const createAppUserSelectFirstItemUseCase = () => {
    return new AppUserSelectFirstItemUseCase(gitHubSearchStreamRepository);
};

export class AppUserSelectFirstItemUseCase extends UseCase {
    constructor(public gitHubSearchStreamRepository: GitHubSearchStreamRepository) {
        super();
    }

    execute() {
        const stream = this.gitHubSearchStreamRepository.get();
        const firstItem = stream.getFirstItem();
        if (!firstItem) {
            return;
        }
        return this.context.useCase(createAppUserSelectItemUseCase())
            .executor(useCase => useCase.execute(firstItem));
    }
}