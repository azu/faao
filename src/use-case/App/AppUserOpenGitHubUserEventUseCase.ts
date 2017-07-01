// MIT © 2017 azu
import { UseCase } from "almin";
import { OpenItemInNewTabUseCase } from "./OpenItemInNewTabUseCase";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import { GitHubUserActivityEvent } from "../../domain/GitHubUser/GitHubUserActivityEvent";

export const createAppUserOpenGitHubUserEventUseCase = () => {
    return new AppUserOpenGitHubUserEventUseCase(appRepository);
};

export class AppUserOpenGitHubUserEventUseCase extends UseCase {
    constructor(public appRepository: AppRepository) {
        super();
    }

    async execute(activityEvent: GitHubUserActivityEvent) {
        const app = this.appRepository.get();
        app.user.openGitHubUserEvent(activityEvent);
        await this.appRepository.save(app);
        return this.context.useCase(new OpenItemInNewTabUseCase()).executor(useCase => {
            return useCase.execute(activityEvent.htmlURL);
        });
    }
}
