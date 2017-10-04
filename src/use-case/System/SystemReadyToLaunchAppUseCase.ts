// MIT © 2017 azu
import { UseCase } from "almin";
import {
    gitHubSearchListRepository,
    GitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";
import {
    gitHubSearchStreamRepository,
    GitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import {
    gitHubSettingRepository,
    GitHubSettingRepository
} from "../../infra/repository/GitHubSettingsRepository";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import { AppNetworkStatus } from "../../domain/App/AppNetwork";
import { createUpdateAppNetworkStatusUseCase } from "../App/UpdateAppNetworkStatusUseCase";
import {
    gitHubUserRepository,
    GitHubUserRepository
} from "../../infra/repository/GitHubUserRepository";

export const createSystemReadyToLaunchAppUseCase = () => {
    return new SystemReadyToLaunchAppUseCase({
        gitHubSearchListRepository,
        gitHubSearchStreamRepository,
        gitHubSettingRepository,
        gitHubUserRepository,
        appRepository
    });
};

/**
 * Initial application
 *
 * - Initialize app
 * - Setup repositories.
 *    - restore data from database to repository instance.
 */
export class SystemReadyToLaunchAppUseCase extends UseCase {
    constructor(
        private args: {
            gitHubSearchListRepository: GitHubSearchListRepository;
            gitHubSearchStreamRepository: GitHubSearchStreamRepository;
            gitHubSettingRepository: GitHubSettingRepository;
            gitHubUserRepository: GitHubUserRepository;
            appRepository: AppRepository;
        }
    ) {
        super();
    }

    async execute() {
        await this.args.appRepository.ready();
        await this.args.gitHubSettingRepository.ready();
        await this.args.gitHubSearchListRepository.ready();
        await this.args.gitHubSearchStreamRepository.ready();
        await this.args.gitHubUserRepository.ready();
        const networkStatus: AppNetworkStatus =
            typeof navigator !== "undefined" ? (navigator.onLine ? "online" : "offline") : "online";
        return this.context
            .useCase(createUpdateAppNetworkStatusUseCase())
            .executor(useCase => useCase.execute(networkStatus));
    }
}
