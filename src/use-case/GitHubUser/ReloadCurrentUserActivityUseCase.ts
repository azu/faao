// MIT © 2017 azu
import { UseCase } from "almin";
import { AppRepository, appRepository } from "../../infra/repository/AppRepository";
import {
    gitHubUserRepository,
    GitHubUserRepository
} from "../../infra/repository/GitHubUserRepository";
import {
    gitHubSettingRepository,
    GitHubSettingRepository
} from "../../infra/repository/GitHubSettingsRepository";
import { createFetchGitHubUserActivityUseCase } from "./FetchGitHubUserActivityUseCase";

const debug = require("debug")("faao:ReloadCurrentUserActivityUseCase");
export const createReloadCurrentUserActivityUseCase = () => {
    return new ReloadCurrentUserActivityUseCase({
        appRepository,
        gitHubUserRepository,
        gitHubSettingRepository
    });
};

export class ReloadCurrentUserActivityUseCase extends UseCase {
    constructor(
        private args: {
            appRepository: AppRepository;
            gitHubUserRepository: GitHubUserRepository;
            gitHubSettingRepository: GitHubSettingRepository;
        }
    ) {
        super();
    }

    execute() {
        const app = this.args.appRepository.get();
        const openedUserId = app.user.activity.openedUserId;
        if (!openedUserId) {
            return debug("Not found userId");
        }
        const setting = this.args.gitHubSettingRepository.findByGitHubUserId(openedUserId);
        if (!setting) {
            return debug("Not found setting");
        }
        return this.context.useCase(createFetchGitHubUserActivityUseCase()).execute(setting.id);
    }
}
