// MIT © 2017 azu
import { Payload, Store } from "almin";
import { GitHubSetting, GitHubSettingArgs } from "../../domain/GitHubSetting/GitHubSetting";
import { GitHubSettingRepository } from "../../infra/repository/GitHubSettingsRepository";
import {
    CloseSettingPanelUseCasePayload,
    OpenSettingPanelUseCasePayload
} from "../../use-case/GitHubSetting/ToggleSettingPanelUseCase";
import { Identifier } from "../../domain/Entity";
import { shallowEqual } from "shallow-equal-object";
import { GitHubUserRepository } from "../../infra/repository/GitHubUserRepository";

export interface GitHubSettingViewModelArgs extends GitHubSettingArgs {
    loginName?: string;
    avatarURL?: string;
}

/**
 * ViewModel of GitHubSetting
 */
export class GitHubSettingViewModel extends GitHubSetting implements GitHubSettingViewModelArgs {
    loginName?: string;
    avatarURL?: string;

    constructor(args: GitHubSettingViewModelArgs) {
        super({
            id: args.id,
            gitHubUserId: args.gitHubUserId,
            token: args.token,
            apiHost: args.apiHost,
            webHost: args.webHost
        });
        this.loginName = args.loginName;
        this.avatarURL = args.avatarURL;
    }
}

export interface GitHubSettingStateObject {
    settings: GitHubSettingViewModel[];
    editingSetting?: GitHubSetting;
    isOpenSettingPanel: boolean;
}

export class GitHubSettingState implements GitHubSettingStateObject {
    editingSetting?: GitHubSetting;
    settings: GitHubSetting[];
    isOpenSettingPanel: boolean;

    constructor(args: GitHubSettingStateObject) {
        this.settings = args.settings;
        this.editingSetting = args.editingSetting;
        this.isOpenSettingPanel = args.isOpenSettingPanel;
    }

    get editingSettingId(): Identifier<GitHubSetting> | undefined {
        if (!this.editingSetting) {
            return undefined;
        }
        return this.editingSetting.id;
    }

    update(settings: GitHubSettingViewModel[]) {
        if (shallowEqual(this.settings, settings)) {
            return this;
        }
        return new GitHubSettingState({
            ...(this as GitHubSettingStateObject),
            settings: settings
        });
    }

    reduce(
        payload: OpenSettingPanelUseCasePayload | CloseSettingPanelUseCasePayload
    ): GitHubSettingState {
        if (payload instanceof OpenSettingPanelUseCasePayload) {
            return new GitHubSettingState({
                ...(this as GitHubSettingStateObject),
                isOpenSettingPanel: true,
                editingSetting: payload.setting
            });
        } else if (payload instanceof CloseSettingPanelUseCasePayload) {
            return new GitHubSettingState({
                ...(this as GitHubSettingStateObject),
                isOpenSettingPanel: false,
                editingSetting: undefined
            });
        }
        return this;
    }
}

export interface GitHubSettingStoreArgs {
    gitHubSettingRepository: GitHubSettingRepository;
    gitHubUserRepository: GitHubUserRepository;
}

export class GitHubSettingStore extends Store<GitHubSettingState> {
    state: GitHubSettingState;

    constructor(private args: GitHubSettingStoreArgs) {
        super();
        this.state = new GitHubSettingState({
            settings: [],
            isOpenSettingPanel: false
        });
    }

    receivePayload(payload: Payload) {
        const settings = this.args.gitHubSettingRepository.findAll();
        const settingViewModels = settings.map(setting => {
            const user = this.args.gitHubUserRepository.findById(setting.gitHubUserId);
            if (user && user.profile) {
                return new GitHubSettingViewModel({
                    ...setting,
                    loginName: user.profile.loginName,
                    avatarURL: user.profile.avatarURL
                });
            } else {
                return new GitHubSettingViewModel(setting);
            }
        });
        this.setState(this.state.update(settingViewModels).reduce(payload));
    }

    getState(): GitHubSettingState {
        return this.state;
    }
}
