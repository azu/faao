// MIT © 2017 azu
import * as React from "react";
import { SyntheticEvent } from "react";
import { GitHubUserState } from "../../../../store/GitHubUserStore/GitHubUserStore";
import { GitHubUserEventList } from "../../../project/GitHubUserEventList/GitHubUserEventList";
import { GitHubUserActivityEvent } from "../../../../domain/GitHubUser/GitHubUserActivityEvent";

export interface GitHubUserEventContainerProps {
    gitHubUser: GitHubUserState;
}

export class GitHubUserEventContainer extends React.Component<GitHubUserEventContainerProps, {}> {
    onClickItem(event: SyntheticEvent<any>, item: GitHubUserActivityEvent) {
        console.log(event, item);
    }

    render() {
        return (
            <div className="GitHubUserEventContainer">
                <GitHubUserEventList
                    className="GitHubUserEventContainer-main"
                    items={this.props.gitHubUser.events}
                    onClickItem={this.onClickItem}
                />
            </div>
        );
    }
}
