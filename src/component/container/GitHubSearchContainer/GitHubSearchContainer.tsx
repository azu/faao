// MIT © 2017 azu
import * as React from "react";
import { GitHubSearchListState } from "../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { SearchQueryList } from "../../project/SearchQueryList/SearchQueryList";
import { GitHubSearchQuery } from "../../../domain/GitHubSearch/GitHubSearchQuery";
import { SyntheticEvent } from "react";

export interface GitHubSearchContainerProps {
    gitHubSearchList: GitHubSearchListState
}

export class GitHubSearchContainer extends React.Component<GitHubSearchContainerProps, {}> {
    onClickQuery = (event: SyntheticEvent<any>, query: GitHubSearchQuery) => {
        console.log(event, query);
    };

    render() {
        return <div>
            <h1 className='ms-font-xxl'>Inbox</h1>
            <div className='MailList' data-is-scrollable={ true }>
                <SearchQueryList queries={this.props.gitHubSearchList.queries} onClickQuery={this.onClickQuery}/>
            </div>
        </div>
    }
}