// MIT © 2017 azu
import * as React from "react";
import { SyntheticEvent } from "react";
import { GitHubSearchListState } from "../../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { BaseContainer } from "../../BaseContainer";
import classNames from "classnames";
import { GitHubSettingList } from "../../../project/GitHubSettingList/GitHubSettingList";
import { GitHubSetting } from "../../../../domain/GitHubSetting/GitHubSetting";
import { GitHubSettingState } from "../../../../store/GitHubSettingStore/GitHubSettingStore";
import { OpenSettingPanelUseCase } from "../../../../use-case/GitHubSetting/ToggleSettingPanelUseCase";
import { createDeleteSettingUseCase } from "../../../../use-case/GitHubSetting/DeleteSettingUseCase";

export interface GitHubSettingContainerProps {
    className?: string;
    gitHubSetting: GitHubSettingState;
    gitHubSearchList: GitHubSearchListState;
}

export class GitHubSettingContainer extends BaseContainer<GitHubSettingContainerProps, {}> {
    onClickSetting = (event: SyntheticEvent<any>, setting: GitHubSetting) => {
        console.info(event, setting);
    };

    onEditSetting = (_event: SyntheticEvent<any>, setting: GitHubSetting) => {
        this.useCase(new OpenSettingPanelUseCase()).executor(useCase => useCase.execute(setting));
    };

    onClickAddSetting = () => {
        this.useCase(new OpenSettingPanelUseCase()).executor(useCase => useCase.execute());
    };

    onDeleteSetting = (_event: SyntheticEvent<any>, setting: GitHubSetting) => {
        this.useCase(createDeleteSettingUseCase()).executor(useCase => useCase.execute(setting));
    };

    render() {
        return (
            <div className={classNames("GitHubSettingContainer", this.props.className)}>
                <GitHubSettingList
                    settings={this.props.gitHubSetting.settings}
                    onClickSetting={this.onClickSetting}
                    onClickAddSetting={this.onClickAddSetting}
                    onEditSetting={this.onEditSetting}
                    onDeleteSetting={this.onDeleteSetting}
                />
            </div>
        );
    }
}
