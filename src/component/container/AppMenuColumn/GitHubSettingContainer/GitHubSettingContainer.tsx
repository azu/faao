// MIT © 2017 azu
import * as React from "react";
import { GitHubSearchListState } from "../../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { SyntheticEvent } from "react";
import { BaseContainer } from "../../BaseContainer";
import classNames from "classnames";
import { GitHubSettingList } from "../../../project/GitHubSettingList/GitHubSettingList";
import { GitHubSetting } from "../../../../domain/GitHubSetting/GitHubSetting";
import { GitHubSettingState } from "../../../../store/GitHubSettingStore/GitHubSettingStore";
import { OpenSettingPanelUseCase } from "../../../../use-case/GitHubSetting/ToggleSettingPanelUseCase";
import { IconButton } from "office-ui-fabric-react";

export interface GitHubSettingContainerProps {
    className?: string;
    gitHubSetting: GitHubSettingState;
    gitHubSearchList: GitHubSearchListState;
}

export class GitHubSettingContainer extends BaseContainer<GitHubSettingContainerProps, {}> {
    onClickSetting = (event: SyntheticEvent<any>, setting: GitHubSetting) => {
        console.log(event, setting);
    };

    onEditSetting = (_event: SyntheticEvent<any>, setting: GitHubSetting) => {
        this.useCase(new OpenSettingPanelUseCase()).executor(useCase => useCase.execute(setting));
    };

    onClickAddSetting = () => {
        this.useCase(new OpenSettingPanelUseCase()).executor(useCase => useCase.execute());
    };

    render() {
        return (
            <div className={classNames("GitHubSettingContainer", this.props.className)}>
                <h1 className="ms-font-xxl">
                    Accounts
                    <IconButton
                        iconProps={{ iconName: "Add" }}
                        title="Add GitHub account"
                        ariaLabel="Add GitHub account"
                        onClick={this.onClickAddSetting}
                    />
                </h1>
                <GitHubSettingList
                    settings={this.props.gitHubSetting.settings}
                    onClickSetting={this.onClickSetting}
                    onEditSetting={this.onEditSetting}
                />
            </div>
        );
    }
}
