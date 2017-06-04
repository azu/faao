// LICENSE : MIT
"use strict";
import * as React from "react";
import { AppStoreGroupState } from "../../store/AppStoreGroup";
import { GitHubSearchContainer } from "./GitHubSearchContainer/GitHubSearchContainer";
import { GitHubSearchStreamContainer } from "./GitHubSearchStreamContainer/GitHubSearchStreamContainer";
import { BaseContainer } from "./BaseContainer";
import IframeBrowser from "../project/IframeBrowser/IframeBrowser";
import { ShortcutKeyContainer } from "./ShortcutKeyContainer/ShortcutKeyContainer";
import { QuickIssueContainer } from "./QuickIssueContainer/QuickIssueContainer";
import { QuerySettingContainer } from "./QuerySettingContainer/QuerySettionContainer";

export class AppContainer extends BaseContainer<AppStoreGroupState, {}> {
    render() {
        const preview = process.env.RUNTIME_TARGET === "electron"
            ? <main className="AppContainer-preview">
                {/*<IframeBrowser html={"test"}/>*/}
            </main>
            : null;
        return <div className="AppContainer">
            <ShortcutKeyContainer />
            <nav className="AppContainer-nav">
                <GitHubSearchContainer
                    gitHubSearchList={this.props.gitHubSearchList}/>
            </nav>
            <main className="AppContainer-main">
                <GitHubSearchStreamContainer
                    app={this.props.app}
                    gitHubSearchStream={this.props.gitHubSearchStream}
                />
            </main>

            <QuerySettingContainer
                gitHubSetting={this.props.gitHubSetting}
            />
            <QuickIssueContainer
                quickIssue={this.props.quickIssue}
            />
            {preview}
        </div>;
    }
}
