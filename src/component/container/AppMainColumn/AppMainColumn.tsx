// MIT © 2017 azu
import * as React from "react";
import { GitHubSearchStreamContainer } from "./GitHubSearchStreamContainer/GitHubSearchStreamContainer";
import { AppState } from "../../../store/AppStore/AppStore";
import { GitHubSearchStreamState } from "../../../store/GitHubSearchStreamStore/GitHubSearchStreamStore";
import classnames from "classnames";
import { GitHubUserEventContainer } from "./GitHubUserEventContainer/GitHubUserEventContainer";
import { GitHubUserState } from "../../../store/GitHubUserStore/GitHubUserStore";
import * as assert from "assert";

export interface AppMainColumnProps {
    className?: string;
    app: AppState;
    gitHubUser: GitHubUserState;
    gitHubSearchStream: GitHubSearchStreamState;
}

export class AppMainColumn extends React.Component<AppMainColumnProps, {}> {
    render() {
        const userEventContainer = this.props.gitHubUser.shouldShow
            ? <GitHubUserEventContainer gitHubUser={this.props.gitHubUser} />
            : null;
        const searchStreamContainer = this.props.gitHubSearchStream.hasResult
            ? <GitHubSearchStreamContainer
                  app={this.props.app}
                  gitHubSearchStream={this.props.gitHubSearchStream}
              />
            : null;
        assert.ok(!(userEventContainer && searchStreamContainer), "Both is shown. Wrong something");
        return (
            <div className={classnames("AppMainColumn", this.props.className)}>
                {userEventContainer}
                {searchStreamContainer}
            </div>
        );
    }
}
