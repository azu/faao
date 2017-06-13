// LICENSE : MIT
("use strict");
import * as React from "react";
import { AppStoreGroupState } from "../../store/AppStoreGroup";
import { GitHubSearchStreamContainer } from "./GitHubSearchStreamContainer/GitHubSearchStreamContainer";
import { BaseContainer } from "./BaseContainer";
import IframeBrowser from "../project/IframeBrowser/IframeBrowser";
import { ShortcutKeyContainer } from "./ShortcutKeyContainer/ShortcutKeyContainer";
import { QuickIssueContainer } from "./QuickIssueContainer/QuickIssueContainer";
import { QuerySettingContainer } from "./QuerySettingContainer/QuerySettionContainer";
import { GitHubSettingPanelContainer } from "./GitHubSettingPanelContainer/GitHubSettingPanelContainer";
import { AppMenuColumn } from "./AppMenuColumn/AppMenuColumn";
import { ErrorContainer } from "./ErrorContainer/ErrorContainer";
import { ObserverContainer } from "./ObserverContainer/ObserverContainer";

export class AppContainer extends BaseContainer<AppStoreGroupState, {}> {
    render() {
        const preview = process.env.RUNTIME_TARGET === "electron"
            ? <main className="AppContainer-preview">
                  {/*<IframeBrowser html={"test"}/>*/}
              </main>
            : null;
        return (
            <div className="AppContainer">
                <ObserverContainer />
                <ErrorContainer notice={this.props.notice} />
                <ShortcutKeyContainer />
                <AppMenuColumn
                    className="AppContainer-nav"
                    app={this.props.app}
                    gitHubSetting={this.props.gitHubSetting}
                    gitHubSearchList={this.props.gitHubSearchList}
                />
                <main className="AppContainer-main">
                    <GitHubSearchStreamContainer
                        app={this.props.app}
                        gitHubSearchStream={this.props.gitHubSearchStream}
                    />
                </main>
                <GitHubSettingPanelContainer gitHubSetting={this.props.gitHubSetting} />
                <QuerySettingContainer
                    gitHubSearchList={this.props.gitHubSearchList}
                    gitHubSetting={this.props.gitHubSetting}
                />
                <QuickIssueContainer quickIssue={this.props.quickIssue} />
                {preview}
            </div>
        );
    }
}
