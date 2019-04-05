// LICENSE : MIT
import { ProfileContainer } from "./ProfileContainer/ProfileContainer";
import * as React from "react";
import { AppStoreGroupState } from "../../store/AppStoreGroup";
import { BaseContainer } from "./BaseContainer";
import { ShortcutKeyContainer } from "./ShortcutKeyContainer/ShortcutKeyContainer";
import { QuickIssueContainer } from "./QuickIssueContainer/QuickIssueContainer";
import { QuerySettingContainer } from "./QuerySettingContainer/QuerySettionContainer";
import { GitHubSettingPanelContainer } from "./GitHubSettingPanelContainer/GitHubSettingPanelContainer";
import { AppMenuColumn } from "./AppMenuColumn/AppMenuColumn";
import { ErrorContainer } from "./ErrorContainer/ErrorContainer";
import { ObserverContainer } from "./ObserverContainer/ObserverContainer";
import { AppMobileNav } from "./AppMobileNav/AppMobileNav";
import classNames from "classnames";
import { SearchListPanelContainer } from "./SearchListPanelContainer/SearchListPanelContainer";
import { AppMainColumn } from "./AppMainColumn/AppMainColumn";
import { BrowserView } from "./BrowserView/BrowserView";
import isElectron from "is-electron";

const suitcssClassnames = require("suitcss-classnames");

export class AppContainer extends BaseContainer<AppStoreGroupState, {}> {
    render() {
        const AppContainerMobileMenuClassName = suitcssClassnames({
            component: "AppContainerColumn-mobile",
            states: {
                "is-opened": this.props.mobile.isMenuOpened
            }
        });
        const isOpnendPopup =
            this.props.gitHubSetting.isOpenSettingPanel ||
            this.props.gitHubSearchList.isQueryPanelOpened ||
            this.props.gitHubSearchList.isSearchListPanelOpened;
        return (
            <>
                <div className="AppContainer">
                    {/* Systematic */}
                    <ObserverContainer />
                    <ShortcutKeyContainer />
                    {/* Main */}
                    <nav className="AppContainer-mobileNav">
                        <AppMobileNav mobile={this.props.mobile} />
                    </nav>
                    <div className="AppContainer-body">
                        <AppMenuColumn
                            className={classNames(
                                "AppContainer-nav",
                                AppContainerMobileMenuClassName
                            )}
                            app={this.props.app}
                            gitHubSetting={this.props.gitHubSetting}
                            gitHubSearchList={this.props.gitHubSearchList}
                        />
                        <AppMainColumn
                            className={classNames("AppContainer-main")}
                            app={this.props.app}
                            appMainColumn={this.props.appMainColumn}
                            gitHubUser={this.props.gitHubUser}
                            gitHubSearchStream={this.props.gitHubSearchStream}
                        />
                    </div>
                    {/* Panel */}
                    <ErrorContainer notice={this.props.notice} />
                    <ProfileContainer profile={this.props.profile} />
                    <SearchListPanelContainer gitHubSearchList={this.props.gitHubSearchList} />
                    <GitHubSettingPanelContainer gitHubSetting={this.props.gitHubSetting} />
                    <QuerySettingContainer
                        gitHubSearchList={this.props.gitHubSearchList}
                        gitHubSetting={this.props.gitHubSetting}
                    />
                    <QuickIssueContainer quickIssue={this.props.quickIssue} />
                </div>
                {isElectron() ? (
                    <BrowserView
                        visible={!isOpnendPopup}
                        url={
                            this.props.app.activeItem
                                ? this.props.app.activeItem.html_url
                                : "https://github.com"
                        }
                    />
                ) : null}
            </>
        );
    }
}
