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
import { gitHubSettingRepository, GitHubSettingRepository } from "../../infra/repository/GitHubSettingsRepository";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";

export const createReadyRepositoryUseCase = () => {
    return new ReadyRepositoryUseCase({
        gitHubSearchListRepository,
        gitHubSearchStreamRepository,
        gitHubSettingRepository,
        appRepository
    });
};

/**
 * setup repositories.
 * Restore data from database to repository instance.
 */
export class ReadyRepositoryUseCase extends UseCase {
    constructor(
        private args: {
            gitHubSearchListRepository: GitHubSearchListRepository;
            gitHubSearchStreamRepository: GitHubSearchStreamRepository;
            gitHubSettingRepository: GitHubSettingRepository;
            appRepository: AppRepository;
        }
    ) {
        super();
    }

    async execute() {
        await this.args.gitHubSettingRepository.ready();
        await this.args.gitHubSearchListRepository.ready();
        await this.args.gitHubSearchStreamRepository.ready();
    }
}
