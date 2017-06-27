// MIT © 2017 azu
import { UseCase } from "almin";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
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

export const createClearAllStorageUseCase = () => {
    return new ClearAllStorageUseCase(
        appRepository,
        gitHubSearchListRepository,
        gitHubSearchStreamRepository,
        gitHubSettingRepository
    );
};

/**
 * Clear all storage data
 */
export class ClearAllStorageUseCase extends UseCase {
    appRepository: AppRepository;
    gitHubSearchListRepository: GitHubSearchListRepository;
    gitHubSearchStreamRepository: GitHubSearchStreamRepository;
    gitHubSettingRepository: GitHubSettingRepository;

    constructor(
        appRepository: AppRepository,
        gitHubSearchListRepository: GitHubSearchListRepository,
        gitHubSearchStreamRepository: GitHubSearchStreamRepository,
        gitHubSettingRepository: GitHubSettingRepository
    ) {
        super();
        this.appRepository = appRepository;
        this.gitHubSearchListRepository = gitHubSearchListRepository;
        this.gitHubSettingRepository = gitHubSettingRepository;
        this.gitHubSearchStreamRepository = gitHubSearchStreamRepository;
    }

    execute() {
        return Promise.all([
            this.appRepository.clear(),
            this.gitHubSearchListRepository.clear(),
            this.gitHubSettingRepository.clear(),
            this.gitHubSearchStreamRepository.clear()
        ]);
    }
}
