// LICENSE : MIT
import { ProfileContainer } from "./ProfileContainer/ProfileContainer";
import * as React from "react";
import { AppStoreGroupState } from "../../store/AppStoreGroup";
import { GitHubSearchStreamContainer } from "./GitHubSearchStreamContainer/GitHubSearchStreamContainer";
import { BaseContainer } from "./BaseContainer";
import { ShortcutKeyContainer } from "./ShortcutKeyContainer/ShortcutKeyContainer";
import { QuickIssueContainer } from "./QuickIssueContainer/QuickIssueContainer";
import { QuerySettingContainer } from "./QuerySettingContainer/QuerySettionContainer";
import { GitHubSettingPanelContainer } from "./GitHubSettingPanelContainer/GitHubSettingPanelContainer";
import { AppMenuColumn } from "./AppMenuColumn/AppMenuColumn";
import { ErrorContainer } from "./ErrorContainer/ErrorContainer";
import { ObserverContainer } from "./ObserverContainer/ObserverContainer";
import { AppMobileNav } from "./AppMobileNav/AppMobileNav";
import classNames from "classNames";

const suitcssClassnames = require("suitcss-classnames");

export class AppContainer extends BaseContainer<AppStoreGroupState, {}> {
    render() {
        const AppContainerNavClassName = suitcssClassnames({
            component: "AppContainerColumn-mobile",
            states: {
                "is-opened": this.props.mobile.isMenuOpened
            }
        });
        return (
            <div className="AppContainer">
                <ProfileContainer profile={this.props.profile} />
                <ObserverContainer />
                <ErrorContainer notice={this.props.notice} />
                <ShortcutKeyContainer />
                {/* Actual DOM*/}
                <nav className="AppContainer-mobileNav">
                    <AppMobileNav mobile={this.props.mobile} />
                </nav>
                <div className="AppContainer-body">
                    <AppMenuColumn
                        className={classNames("AppContainer-nav", AppContainerNavClassName)}
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
                </div>
                <GitHubSettingPanelContainer gitHubSetting={this.props.gitHubSetting} />
                <QuerySettingContainer
                    gitHubSearchList={this.props.gitHubSearchList}
                    gitHubSetting={this.props.gitHubSetting}
                />
                <QuickIssueContainer quickIssue={this.props.quickIssue} />
            </div>
        );
    }
}
