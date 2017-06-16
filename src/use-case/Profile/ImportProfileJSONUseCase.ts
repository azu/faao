// MIT © 2017 azu
import { Payload, UseCase } from "almin";
import {
    gitHubSearchListRepository,
    GitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";
import {
    gitHubSettingRepository,
    GitHubSettingRepository
} from "../../infra/repository/GitHubSettingsRepository";
import { ProfileService } from "../../domain/profile/ProfileService";
import { ProfileJSON } from "../../domain/profile/Profile";

export const createImportProfileJSONUseCase = () => {
    return new ImportProfileJSONUseCase({
        gitHubSettingRepository,
        gitHubSearchListRepository
    });
};

export class ImportProfileJSONUseCase extends UseCase {
    constructor(
        private args: {
            gitHubSettingRepository: GitHubSettingRepository;
            gitHubSearchListRepository: GitHubSearchListRepository;
        }
    ) {
        super();
    }

    async execute(json: ProfileJSON) {
        const profile = ProfileService.fromJSON(json);
        // clear
        const clear = [
            this.args.gitHubSearchListRepository.clear(),
            this.args.gitHubSettingRepository.clear()
        ];
        await Promise.all(clear);
        // set new profile
        const settingsUpdatingPromises = profile.GitHubSettings.map(setting => {
            return this.args.gitHubSettingRepository.save(setting);
        });
        const searchListUpdatingPromises = profile.GitHubSearchLists.map(searchList => {
            return this.args.gitHubSearchListRepository.save(searchList);
        });
        return Promise.all([...settingsUpdatingPromises, ...searchListUpdatingPromises]);
    }
}
