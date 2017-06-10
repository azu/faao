// MIT © 2017 azu
import { Payload, Store } from "almin";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";
import { GitHubSettingRepository } from "../../infra/repository/GitHubSettingsRepository";
import {
    CloseSettingPanelUseCasePayload,
    OpenSettingPanelUseCasePayload
} from "../../use-case/GitHubSetting/ToggleSettingPanelUseCase";
import { EntityId } from "../../domain/Entity";

export interface GitHubSettingStateObject {
    settings: GitHubSetting[];
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

    get editingSettingId(): EntityId<GitHubSetting> | undefined {
        if (!this.editingSetting) {
            return undefined;
        }
        return this.editingSetting.id;
    }

    update(settings: GitHubSetting[]) {
        return new GitHubSettingState({
            ...this as GitHubSettingStateObject,
            settings: settings
        });
    }

    reduce(payload: OpenSettingPanelUseCasePayload | CloseSettingPanelUseCasePayload): GitHubSettingState {
        if (payload instanceof OpenSettingPanelUseCasePayload) {
            return new GitHubSettingState({
                ...this as GitHubSettingStateObject,
                isOpenSettingPanel: true,
                editingSetting: payload.setting
            });
        } else if (payload instanceof CloseSettingPanelUseCasePayload) {
            return new GitHubSettingState({
                ...this as GitHubSettingStateObject,
                isOpenSettingPanel: false,
                editingSetting: undefined
            });
        }
        return this;
    }
}

export class GitHubSettingStore extends Store<GitHubSettingState> {
    state: GitHubSettingState;

    constructor(public gitHubSettingRepository: GitHubSettingRepository) {
        super();
        this.state = new GitHubSettingState({
            settings: [],
            isOpenSettingPanel: false
        });
    }

    receivePayload(payload: Payload) {
        const settings = this.gitHubSettingRepository.findAll();
        this.setState(this.state.update(settings).reduce(payload));
    }

    getState(): GitHubSettingState {
        return this.state;
    }
}
