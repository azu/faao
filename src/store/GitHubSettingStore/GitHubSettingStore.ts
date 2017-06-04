// MIT © 2017 azu
import { Store } from "almin";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";
import { GitHubSettingRepository } from "../../infra/repository/GitHubSettingsRepository";

export interface GitHubSettingStateObject {
    settings: GitHubSetting[]
}

export class GitHubSettingState implements GitHubSettingStateObject {
    settings: GitHubSetting[];

    constructor(args: GitHubSettingStateObject) {
        this.settings = args.settings;
    }
}

export class GitHubSettingStore extends Store<GitHubSettingState> {
    state: GitHubSettingState;

    constructor(public gitHubSettingRepository: GitHubSettingRepository) {
        super();
        this.state = new GitHubSettingState({
            settings: []
        });
    }

    receivePayload() {
        const settings = this.gitHubSettingRepository.findAll();
        this.setState(new GitHubSettingState({
            settings
        }));
    }

    getState(): GitHubSettingState {
        return this.state;
    }
}