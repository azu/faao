// MIT © 2017 azu
import * as React from "react";
import { GitHubSearchStreamContainer } from "./GitHubSearchStreamContainer/GitHubSearchStreamContainer";
import { AppState } from "../../../store/AppStore/AppStore";
import { GitHubSearchStreamState } from "../../../store/GitHubSearchStreamStore/GitHubSearchStreamStore";
import classnames from "classnames";
import { GitHubUserEventContainer } from "./GitHubUserEventContainer/GitHubUserEventContainer";
import { GitHubUserState } from "../../../store/GitHubUserStore/GitHubUserStore";
import {
    AppMainColumnShowType,
    AppMainColumnState
} from "../../../store/AppMainColumnStore/AppMainColumnStore";

export interface AppMainColumnProps {
    className?: string;
    app: AppState;
    gitHubUser: GitHubUserState;
    gitHubSearchStream: GitHubSearchStreamState;
    appMainColumn: AppMainColumnState;
}

export class AppMainColumn extends React.Component<AppMainColumnProps, {}> {
    render() {
        const showContainer = this.getShowContainer(this.props.appMainColumn.showType);
        return (
            <div className={classnames("AppMainColumn", this.props.className)}>{showContainer}</div>
        );
    }

    getShowContainer(showType: AppMainColumnShowType) {
        if (showType === AppMainColumnShowType.GitHubStream) {
            return (
                <GitHubSearchStreamContainer
                    app={this.props.app}
                    gitHubSearchStream={this.props.gitHubSearchStream}
                />
            );
        } else if (showType === AppMainColumnShowType.GitHubUserActivity) {
            return <GitHubUserEventContainer gitHubUser={this.props.gitHubUser} />;
        } else {
            return null;
        }
    }
}
