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

    execute(json: ProfileJSON) {
        const profile = ProfileService.fromJSON(json);
        // clear
        this.args.gitHubSearchListRepository.clear();
        this.args.gitHubSettingRepository.clear();
        // set new profile
        profile.GitHubSettings.forEach(setting => {
            this.args.gitHubSettingRepository.save(setting);
        });
        profile.GitHubSearchLists.forEach(searchList => {
            this.args.gitHubSearchListRepository.save(searchList);
        });
    }
}
