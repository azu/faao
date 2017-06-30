// MIT © 2017 azu
import { UseCase } from "almin";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import {
    gitHubSettingRepository,
    GitHubSettingRepository
} from "../../infra/repository/GitHubSettingsRepository";
import { findGitHubUserByGitHubSettingId } from "../DomainConnection/GItHubSettingToGitHubUser";
import {
    gitHubUserRepository,
    GitHubUserRepository
} from "../../infra/repository/GitHubUserRepository";
import { Identifier } from "../../domain/Entity";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";
import { createFetchGitHubUserActivityUseCase } from "../GitHubUser/FetchGitHubUserActivityUseCase";

export const createAppUserOpenGitHubUserEventUseCase = () => {
    return new AppUserOpenGitHubUserEventUseCase({
        appRepository,
        gitHubSettingRepository,
        gitHubUserRepository
    });
};

export class AppUserOpenGitHubUserEventUseCase extends UseCase {
    constructor(
        private args: {
            appRepository: AppRepository;
            gitHubSettingRepository: GitHubSettingRepository;
            gitHubUserRepository: GitHubUserRepository;
        }
    ) {
        super();
    }

    async execute(gitHubSettingId: string | Identifier<GitHubSetting>) {
        const app = this.args.appRepository.get();
        const gitHubSetting = this.args.gitHubSettingRepository.findById(gitHubSettingId);
        if (!gitHubSetting) {
            return;
        }
        const gitHubUser = findGitHubUserByGitHubSettingId({
            gitHubSettingID: gitHubSetting.id,
            gitHubSettingRepository: this.args.gitHubSettingRepository,
            gitHubUserRepository: this.args.gitHubUserRepository
        });
        if (!gitHubUser) {
            return;
        }
        app.user.openGitHubUserEvents(gitHubUser);
        await this.args.appRepository.save(app);
        return this.context
            .useCase(createFetchGitHubUserActivityUseCase())
            .executor(useCase => useCase.execute(gitHubSetting.id));
    }
}
