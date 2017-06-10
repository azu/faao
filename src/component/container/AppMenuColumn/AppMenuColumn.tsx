// MIT © 2017 azu
import * as React from "react";
import { BaseContainer } from "../BaseContainer";
import { GitHubSettingContainer } from "./GitHubSettingContainer/GitHubSettingContainer";
import { GitHubSettingState } from "../../../store/GitHubSettingStore/GitHubSettingStore";
import { GitHubSearchListState } from "../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { AppMenuHeaderContainer } from "./AppMenuHeaderContainer/AppMenuHeaderContainer";
import { GitHubSearchContainer } from "./GitHubSearchContainer/GitHubSearchContainer";
import classNames from "classnames";

export interface AppMenuColumnProps {
    gitHubSetting: GitHubSettingState;
    gitHubSearchList: GitHubSearchListState;
    className?: string;
}

export class AppMenuColumn extends BaseContainer<AppMenuColumnProps, {}> {
    render() {
        console.log("this.props.gitHubSetting", this.props.gitHubSetting);
        return (
            <nav className={classNames("AppMenuColumn", this.props.className)}>
                <AppMenuHeaderContainer
                    className="AppMenuColumn-header"
                    gitHubSetting={this.props.gitHubSetting}
                    gitHubSearchList={this.props.gitHubSearchList}
                />
                <GitHubSettingContainer
                    className="AppMenuColumn-setting"
                    gitHubSetting={this.props.gitHubSetting}
                    gitHubSearchList={this.props.gitHubSearchList}
                />
                <GitHubSearchContainer
                    className="AppMenuColumn-search"
                    gitHubSetting={this.props.gitHubSetting}
                    gitHubSearchList={this.props.gitHubSearchList}
                />
            </nav>
        );
    }
}
