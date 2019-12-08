// MIT © 2017 azu
import * as React from "react";
import { SyntheticEvent } from "react";
import {
    GitHubUserActivityEventViewModel,
    GitHubUserState
} from "../../../../store/GitHubUserStore/GitHubUserStore";
import { GitHubUserEventList } from "../../../project/GitHubUserEventList/GitHubUserEventList";
import { BaseContainer } from "../../BaseContainer";
import { createAppUserOpenGitHubUserEventUseCase } from "../../../../use-case/App/AppUserOpenGitHubUserEventUseCase";
import { GitHubUserEventContainerCommandBarContainer } from "./GitHubUserEventContainerCommandBarContainer/GitHubUserEventContainerCommandBarContainer";

export interface GitHubUserEventContainerProps {
    gitHubUser: GitHubUserState;
}

export class GitHubUserEventContainer extends BaseContainer<GitHubUserEventContainerProps, {}> {
    onClickItem = (event: SyntheticEvent<any>, item: GitHubUserActivityEventViewModel) => {
        event.preventDefault();
        this.useCase(createAppUserOpenGitHubUserEventUseCase()).execute(item);
    };

    render() {
        return (
            <div className="GitHubUserEventContainer">
                <GitHubUserEventContainerCommandBarContainer
                    className="GitHubUserEventContainer-header"
                    filterWord={this.props.gitHubUser.filterWord}
                />
                <GitHubUserEventList
                    className="GitHubUserEventContainer-main"
                    items={this.props.gitHubUser.events}
                    activeEvent={this.props.gitHubUser.activeEvent}
                    onClickItem={this.onClickItem}
                />
            </div>
        );
    }
}
