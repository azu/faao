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

export class ExportProfileUseCasePayload extends Payload {
    constructor(public json: ProfileJSON) {
        super({
            type: "ExportProfileUseCasePayload"
        });
    }
}

export const createExportProfileUseCase = () => {
    return new ExportProfileUseCase({
        gitHubSettingRepository,
        gitHubSearchListRepository
    });
};

export class ExportProfileUseCase extends UseCase {
    constructor(
        private args: {
            gitHubSettingRepository: GitHubSettingRepository;
            gitHubSearchListRepository: GitHubSearchListRepository;
        }
    ) {
        super();
    }

    execute() {
        const GitHubSearchLists = this.args.gitHubSearchListRepository.findAll();
        const GitHubSettings = this.args.gitHubSettingRepository.findAll();
        const profileJSON = ProfileService.toJSON({
            GitHubSearchLists,
            GitHubSettings
        });
        this.dispatch(new ExportProfileUseCasePayload(profileJSON));
    }
}
