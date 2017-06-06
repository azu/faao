// MIT © 2017 azu
import { UseCase } from "almin";
import { AppRepository, appRepository } from "../../infra/repository/AppRepository";
import { createSearchGitHubUseCase } from "../GitHubSearchList/SearchGitHubUseCase";

export const createReloadActiveStreamUseCase = () => {
    return new ReloadActiveStreamUseCase(appRepository);
};

export class ReloadActiveStreamUseCase extends UseCase {
    constructor(public appRepository: AppRepository) {
        super();
    }

    execute() {
        const app = this.appRepository.get();
        const activeQuery = app.user.activity.activeQuery;
        if (!activeQuery) {
            return;
        }
        // TODO: will not focus active item
        return this.context.useCase(createSearchGitHubUseCase()).executor(useCase => useCase.execute(activeQuery));
    }
}
