// MIT © 2017 azu
import { UseCase } from "almin";
import {
    gitHubSearchListRepository,
    GitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";
import {
    gitHubSettingRepository,
    GitHubSettingRepository
} from "../../infra/repository/GitHubSettingsRepository";
import { ProfileService } from "../../domain/Profile/ProfileService";
import { ProfileJSON } from "../../domain/Profile/Profile";
import {
    gitHubUserRepository,
    GitHubUserRepository
} from "../../infra/repository/GitHubUserRepository";

export const createImportProfileJSONUseCase = () => {
    return new ImportProfileJSONUseCase({
        gitHubSettingRepository,
        gitHubSearchListRepository,
        gitHubUserRepository
    });
};

export class ImportProfileJSONUseCase extends UseCase {
    constructor(
        private args: {
            gitHubSettingRepository: GitHubSettingRepository;
            gitHubSearchListRepository: GitHubSearchListRepository;
            gitHubUserRepository: GitHubUserRepository;
        }
    ) {
        super();
    }

    async execute(json: ProfileJSON) {
        const profile = ProfileService.fromJSON(json);
        // clear
        const clear = [
            this.args.gitHubSearchListRepository.clear(),
            this.args.gitHubSettingRepository.clear(),
            this.args.gitHubUserRepository.clear()
        ];
        await Promise.all(clear);
        // set new profile
        const settingsUpdatingPromises = profile.GitHubSettings.map(setting => {
            return this.args.gitHubSettingRepository.save(setting);
        });
        const searchListUpdatingPromises = profile.GitHubSearchLists.map(searchList => {
            return this.args.gitHubSearchListRepository.save(searchList);
        });
        const gitHubUserUpdatingPromises = profile.GitHubUsers.map(gitHubUser => {
            return this.args.gitHubUserRepository.save(gitHubUser);
        });
        return Promise.all([
            ...settingsUpdatingPromises,
            ...searchListUpdatingPromises,
            ...gitHubUserUpdatingPromises
        ]);
    }
}
