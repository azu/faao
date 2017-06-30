// MIT © 2017 azu
import * as React from "react";
import { GitHubSearchStreamContainer } from "./GitHubSearchStreamContainer/GitHubSearchStreamContainer";
import { AppState } from "../../../store/AppStore/AppStore";
import { GitHubSearchStreamState } from "../../../store/GitHubSearchStreamStore/GitHubSearchStreamStore";
import classnames from "classnames";

export interface AppMainColumnProps {
    className?: string;
    app: AppState;
    gitHubSearchStream: GitHubSearchStreamState;
}

export class AppMainColumn extends React.Component<AppMainColumnProps, {}> {
    render() {
        return (
            <div className={classnames("AppMainColumn", this.props.className)}>
                <GitHubSearchStreamContainer
                    app={this.props.app}
                    gitHubSearchStream={this.props.gitHubSearchStream}
                />
            </div>
        );
    }
}
