// MIT © 2017 azu
import { UseCase } from "almin";
import {
    gitHubUserRepository,
    GitHubUserRepository
} from "../../infra/repository/GitHubUserRepository";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";
import { Identifier } from "../../domain/Entity";
import {
    gitHubSettingRepository,
    GitHubSettingRepository
} from "../../infra/repository/GitHubSettingsRepository";
import { GitHubClient } from "../../infra/api/GitHubClient";
import { GitHubUserActivityEvent } from "../../domain/GitHubUser/GitHubUserActivityEvent";

const debug = require("debug")("faao:FetchGitHubUserActivityUseCase");
export const createFetchGitHubUserActivityUseCase = () => {
    return new FetchGitHubUserActivityUseCase({
        gitHubUserRepository,
        gitHubSettingRepository
    });
};

export class FetchGitHubUserActivityUseCase extends UseCase {
    constructor(
        private args: {
            gitHubUserRepository: GitHubUserRepository;
            gitHubSettingRepository: GitHubSettingRepository;
        }
    ) {
        super();
    }

    execute(gitHubSettingID: Identifier<GitHubSetting>) {
        const gitHubSetting = this.args.gitHubSettingRepository.findById(gitHubSettingID);
        if (!gitHubSetting) {
            return debug("Not found gitHubSettingID: %o", gitHubSettingID);
        }
        const gitHubUser = this.args.gitHubUserRepository.findById(gitHubSetting.gitHubUserId);
        if (!gitHubUser) {
            return debug("Not found gitHubUser, gitHubSettingID: %o", gitHubSettingID);
        }
        const gitHubClient = new GitHubClient(gitHubSetting);
        return new Promise((resolve, reject) => {
            gitHubClient.events(
                async (events: GitHubUserActivityEvent[]) => {
                    const isContinue = gitHubUser.needMorePreviousEvents(events);
                    gitHubUser.activity.mergeEvents(events);
                    await this.args.gitHubUserRepository.save(gitHubUser);
                    return isContinue;
                },
                (error: Error) => {
                    reject(error);
                },
                () => {
                    resolve();
                }
            );
        });
    }
}
