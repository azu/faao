// MIT © 2017 azu
import * as React from "react";
import { BaseContainer } from "../BaseContainer";
import { GitHubSettingContainer } from "./GitHubSettingContainer/GitHubSettingContainer";
import { GitHubSettingState } from "../../../store/GitHubSettingStore/GitHubSettingStore";
import { GitHubSearchListState } from "../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { AppMenuHeaderContainer } from "./AppMenuHeaderContainer/AppMenuHeaderContainer";
import { GitHubSearchContainer } from "./GitHubSearchContainer/GitHubSearchContainer";
import classNames from "classnames";
import { AppState } from "../../../store/AppStore/AppStore";
import { AppMenuFooterContainer } from "./AppMenuFooterContainer/AppMenuFooterContainer";

export interface AppMenuColumnProps {
    app: AppState;
    gitHubSetting: GitHubSettingState;
    gitHubSearchList: GitHubSearchListState;
    className?: string;
}

export class AppMenuColumn extends BaseContainer<AppMenuColumnProps, {}> {
    render() {
        return (
            <div className={classNames("AppMenuColumn", this.props.className)}>
                <AppMenuHeaderContainer
                    className="AppMenuColumn-header"
                    app={this.props.app}
                    gitHubSetting={this.props.gitHubSetting}
                    gitHubSearchList={this.props.gitHubSearchList}
                />
                <div className="AppMenuHeaderContainer-main">
                    <GitHubSettingContainer
                        className="AppMenuColumn-setting"
                        gitHubSetting={this.props.gitHubSetting}
                        gitHubSearchList={this.props.gitHubSearchList}
                    />
                    <GitHubSearchContainer
                        className="AppMenuColumn-search"
                        app={this.props.app}
                        gitHubSetting={this.props.gitHubSetting}
                        gitHubSearchList={this.props.gitHubSearchList}
                    />
                </div>
                <AppMenuFooterContainer
                    className="AppMenuColumn-footer"
                    app={this.props.app}
                    gitHubSetting={this.props.gitHubSetting}
                    gitHubSearchList={this.props.gitHubSearchList}
                />
            </div>
        );
    }
}
