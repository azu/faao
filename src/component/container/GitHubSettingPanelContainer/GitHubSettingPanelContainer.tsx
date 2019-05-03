// MIT © 2017 azu
import * as React from "react";
import { BaseContainer } from "../BaseContainer";
import { GitHubSettingState } from "../../../store/GitHubSettingStore/GitHubSettingStore";
import { GitHubSettingJSON } from "../../../domain/GitHubSetting/GitHubSetting";
import { GitHubSettingPanel } from "../../project/GitHubSettingPanel/GitHubSettingPanel";
import { createSaveGitHubSettingUseCase } from "../../../use-case/GitHubSetting/SaveGitHubSettingUseCase";
import { CloseSettingPanelUseCase } from "../../../use-case/GitHubSetting/ToggleSettingPanelUseCase";
import { CheckGrantGitHubAPIUseCase } from "../../../use-case/GitHubSetting/CheckGrantGitHubAPIUseCase";
import { createShowGenericErrorUseCase } from "../../../use-case/Notice/ShowGenericErrorUseCase";

export interface GitHubSettingPanelContainerProps {
    gitHubSetting: GitHubSettingState;
}

export class GitHubSettingPanelContainer extends BaseContainer<
    GitHubSettingPanelContainerProps,
    {}
> {
    onDismiss = () => {
        this.useCase(new CloseSettingPanelUseCase()).execute();
    };

    onSubmit = async (settingJSON: GitHubSettingJSON) => {
        try {
            // check grant
            await this.useCase(new CheckGrantGitHubAPIUseCase()).execute(settingJSON);
            // update setting
            if (this.props.gitHubSetting.editingSetting) {
                await this.useCase(createSaveGitHubSettingUseCase()).execute(
                    settingJSON,
                    this.props.gitHubSetting.editingSettingId
                );
            } else {
                await this.useCase(createSaveGitHubSettingUseCase()).execute(settingJSON);
            }
        } catch (error) {
            await this.useCase(createShowGenericErrorUseCase()).execute(error as Error);
        } finally {
            await this.useCase(new CloseSettingPanelUseCase()).execute();
        }
    };

    render() {
        if (!this.props.gitHubSetting.isOpenSettingPanel) {
            return null;
        }
        return (
            <GitHubSettingPanel
                isOpen={this.props.gitHubSetting.isOpenSettingPanel}
                onDismiss={this.onDismiss}
                onSubmit={this.onSubmit}
                settings={this.props.gitHubSetting.settings}
                setting={this.props.gitHubSetting.editingSetting}
            />
        );
    }
}
