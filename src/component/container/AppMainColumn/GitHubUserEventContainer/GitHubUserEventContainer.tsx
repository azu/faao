// MIT © 2017 azu
import * as React from "react";
import { SyntheticEvent } from "react";
import {
    GitHubUserActivityEventVideoModel,
    GitHubUserState
} from "../../../../store/GitHubUserStore/GitHubUserStore";
import { GitHubUserEventList } from "../../../project/GitHubUserEventList/GitHubUserEventList";
import { BaseContainer } from "../../BaseContainer";
import { createAppUserOpenGitHubUserEventUseCase } from "../../../../use-case/App/AppUserOpenGitHubUserEventUseCase";

export interface GitHubUserEventContainerProps {
    gitHubUser: GitHubUserState;
}

export class GitHubUserEventContainer extends BaseContainer<GitHubUserEventContainerProps, {}> {
    onClickItem = (_event: SyntheticEvent<any>, item: GitHubUserActivityEventVideoModel) => {
        this.useCase(createAppUserOpenGitHubUserEventUseCase()).executor(useCase =>
            useCase.execute(item)
        );
    };

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
