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
import { ProfileService } from "../../domain/Profile/ProfileService";
import { ProfileJSON } from "../../domain/Profile/Profile";
import {
    gitHubUserRepository,
    GitHubUserRepository
} from "../../infra/repository/GitHubUserRepository";

export class ExportProfileUseCasePayload extends Payload {
    type = "ExportProfileUseCasePayload";
    constructor(public json: ProfileJSON) {
        super();
    }
}

export const createExportProfileUseCase = () => {
    return new ExportProfileUseCase({
        gitHubSettingRepository,
        gitHubSearchListRepository,
        gitHubUserRepository
    });
};

export class ExportProfileUseCase extends UseCase {
    constructor(
        private args: {
            gitHubSettingRepository: GitHubSettingRepository;
            gitHubSearchListRepository: GitHubSearchListRepository;
            gitHubUserRepository: GitHubUserRepository;
        }
    ) {
        super();
    }

    execute() {
        const GitHubSearchLists = this.args.gitHubSearchListRepository.findAll();
        const GitHubSettings = this.args.gitHubSettingRepository.findAll();
        const GitHubUsers = this.args.gitHubUserRepository.findAll();
        const profileJSON = ProfileService.toJSON({
            GitHubSearchLists,
            GitHubSettings,
            GitHubUsers
        });
        this.dispatch(new ExportProfileUseCasePayload(profileJSON));
    }
}
