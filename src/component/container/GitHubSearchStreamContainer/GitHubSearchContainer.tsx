// MIT © 2017 azu
import * as React from "react";
import { GitHubSearchListState } from "../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { GitHubSearchQuery } from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { SyntheticEvent } from "react";
import { SearchResultList } from "../../project/SearchResultList/SearchResultList";
import { GitHubSearchStreamState } from "../../../store/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";

export interface GitHubSearchStreamContainerProps {
    gitHubSearchStream: GitHubSearchStreamState
}

export class GitHubSearchStreamContainer extends React.Component<GitHubSearchStreamContainerProps, {}> {
    onClickItem = (event: SyntheticEvent<any>, item: GitHubSearchResultItem) => {
        console.log(event, item);
    };

    render() {
        return <div>
            <h1 className='ms-font-xxl'>Result</h1>
            <div className='MailList'>
                <SearchResultList items={this.props.gitHubSearchStream.items} onClickItem={this.onClickItem}/>
            </div>
        </div>
    }
}