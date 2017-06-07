// MIT © 2017 azu
import { UseCase } from "almin";
import { AppRepository, appRepository } from "../../infra/repository/AppRepository";
import { createSearchGitHubAbstractUseCase } from "../GitHubSearchList/SearchQueryToUpdateStreamUseCase";

export const createReloadActiveStreamUseCase = () => {
    return new ReloadActiveStreamUseCase(appRepository);
};

export class ReloadActiveStreamUseCase extends UseCase {
    constructor(public appRepository: AppRepository) {
        super();
    }

    async execute() {
        const app = this.appRepository.get();
        const activeQuery = app.user.activity.activeQuery;
        const activeStream = app.user.activity.activeStream;
        if (!activeQuery || !activeStream) {
            return;
        }
        return this.context.useCase(createSearchGitHubAbstractUseCase()).executor(useCase => {
            return useCase.execute(activeQuery, activeStream);
        });
    }
}
