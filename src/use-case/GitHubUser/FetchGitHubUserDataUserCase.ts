// MIT © 2017 azu
import { UseCase } from "almin";
import {
    gitHubUserRepository,
    GitHubUserRepository
} from "../../infra/repository/GitHubUserRepository";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";
import {
    gitHubSettingRepository,
    GitHubSettingRepository
} from "../../infra/repository/GitHubSettingsRepository";
import { GitHubUserFactory } from "../../domain/GitHubUser/GitHubUserFactory";
import { GitHubClient } from "../../infra/api/GitHubClient";
import { Identifier } from "../../domain/Entity";
import { findGitHubUserByGitHubSettingId } from "../DomainConnection/GItHubSettingToGitHubUser";

export const createFetchGitHubUserDataUserCase = () => {
    return new FetchGitHubUserDataUserCase({
        gitHubSettingRepository,
        gitHubUserRepository
    });
};

export class FetchGitHubUserDataUserCase extends UseCase {
    constructor(
        private args: {
            gitHubSettingRepository: GitHubSettingRepository;
            gitHubUserRepository: GitHubUserRepository;
        }
    ) {
        super();
    }

    async execute(gitHubSettingID: Identifier<GitHubSetting>) {
        const gitHubSetting = this.args.gitHubSettingRepository.findById(gitHubSettingID);
        if (!gitHubSetting) {
            return;
        }
        const gitHubClient = new GitHubClient(gitHubSetting);
        const gitHubUser =
            findGitHubUserByGitHubSettingId(
                {
                    gitHubSettingID: gitHubSetting.id,
                    gitHubUserRepository: this.args.gitHubUserRepository,
                    gitHubSettingRepository: this.args.gitHubSettingRepository
                }
            ) || GitHubUserFactory.create();
        const profile = await gitHubClient.userProfile();
        gitHubUser.updateProfile(profile);
        // save githubuser
        await this.args.gitHubUserRepository.save(gitHubUser);
        // save relation
        gitHubSetting.setRelationshipWithGitHubUser(gitHubUser);
        return this.args.gitHubSettingRepository.save(gitHubSetting);
    }
}
