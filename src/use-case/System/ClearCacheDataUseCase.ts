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

export const createClearCacheDataUseCase = () => {
    return new ClearCacheDataUseCase(
        appRepository,
        gitHubSearchListRepository,
        gitHubSearchStreamRepository,
        gitHubSettingRepository
    );
};

/**
 * Clear cache data
 * It means that clear storage without profile
 */
export class ClearCacheDataUseCase extends UseCase {
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
        return Promise.all([this.appRepository.clear(), this.gitHubSearchStreamRepository.clear()]);
    }
}
