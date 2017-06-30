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
import { createFetchGitHubUserDataUserCase } from "../../../../use-case/GitHubUser/FetchGitHubUserDataUserCase";
import { createFetchGitHubUserActivityUseCase } from "../../../../use-case/GitHubUser/FetchGitHubUserActivityUseCase";

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

    onRefreshSetting = (_event: SyntheticEvent<any>, setting: GitHubSetting) => {
        this.useCase(createFetchGitHubUserDataUserCase()).executor(useCase =>
            useCase.execute(setting.id)
        );
    };

    onShowUserEvents = (_event: SyntheticEvent<any>, setting: GitHubSetting) => {
        this.useCase(createFetchGitHubUserActivityUseCase()).executor(useCase =>
            useCase.execute(setting.id)
        );
    };

    render() {
        return (
            <div className={classNames("GitHubSettingContainer", this.props.className)}>
                <GitHubSettingList
                    settings={this.props.gitHubSetting.settings}
                    onClickSetting={this.onClickSetting}
                    onClickAddSetting={this.onClickAddSetting}
                    onRefreshSetting={this.onRefreshSetting}
                    onEditSetting={this.onEditSetting}
                    onDeleteSetting={this.onDeleteSetting}
                    onShowUserEvents={this.onShowUserEvents}
                />
            </div>
        );
    }
}
