// MIT © 2017 azu
import * as React from "react";
import { BaseContainer } from "../BaseContainer";
import { GitHubSettingState } from "../../../store/GitHubSettingStore/GitHubSettingStore";
import { QuerySettingPanel } from "../../project/QuerySettingPanel/QuerySettingPanel";
import { GitHubSearchQueryJSON } from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchListState } from "../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { CloseQueryPanelUseCase } from "../../../use-case/GitHubSearchList/ToggleQueryPanelUseCase";
import { createSaveQueryToSearchListUseCase } from "../../../use-case/App/SaveQueryToSearchListUseCase";
import { createUpdateQueryToSearchListUseCase } from "../../../use-case/App/UpdateQueryToSearchListUseCase";
import { GitHubSettingJSON } from "../../../domain/GitHubSetting/GitHubSetting";
import { GitHubSettingPanel } from "../../project/GitHubSettingPanel/GitHubSettingPanel";
import { createSaveGitHubSettingUseCase } from "../../../use-case/GitHubSetting/SaveGitHubSettingUseCase";
import { CloseSettingPanelUseCase } from "../../../use-case/GitHubSetting/ToggleSettingPanelUseCase";

export interface GitHubSettingPanelContainerProps {
    gitHubSetting: GitHubSettingState;
}

export class GitHubSettingPanelContainer extends BaseContainer<
    GitHubSettingPanelContainerProps,
    {}
> {
    onDismiss = () => {
        this.useCase(new CloseSettingPanelUseCase()).executor(useCase => useCase.execute());
    };

    onSubmit = async (settingJSON: GitHubSettingJSON) => {
        try {
            if (this.props.gitHubSetting.editingSetting) {
                await this.useCase(createSaveGitHubSettingUseCase()).executor(useCase => {
                    return useCase.execute(settingJSON, this.props.gitHubSetting.editingSettingId);
                });
            } else {
                await this.useCase(createSaveGitHubSettingUseCase()).executor(useCase =>
                    useCase.execute(settingJSON)
                );
            }
        } finally {
            await this.useCase(new CloseSettingPanelUseCase()).executor(useCase =>
                useCase.execute()
            );
        }
    };

    render() {
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
