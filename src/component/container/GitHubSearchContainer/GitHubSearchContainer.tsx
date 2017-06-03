// MIT © 2017 azu
import * as React from "react";
import { GitHubSearchListState } from "../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { SearchQueryList } from "../../project/SearchQueryList/SearchQueryList";
import { GitHubSearchQuery } from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { SyntheticEvent } from "react";
import { BaseContainer } from "../BaseContainer";
import { createSearchGitHubUseCase } from "../../../use-case/GitHubSearchList/SearchGitHubUseCase";
import classNames from "classnames";

export interface GitHubSearchContainerProps {
    className?: string;
    gitHubSearchList: GitHubSearchListState;
}

export class GitHubSearchContainer extends BaseContainer<GitHubSearchContainerProps, {}> {
    onClickQuery = (_event: SyntheticEvent<any>, query: GitHubSearchQuery) => {
        this.useCase(createSearchGitHubUseCase()).executor(useCase => useCase.execute(query))
    };

    render() {
        return <div className={classNames("GitHubSearchContainer", this.props.className)}>
            <h1 className='ms-font-xxl'>Inbox</h1>
            <div className='MailList' data-is-scrollable={ true }>
                <SearchQueryList queries={this.props.gitHubSearchList.queries} onClickQuery={this.onClickQuery}/>
            </div>
        </div>
    }
}