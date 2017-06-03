// MIT © 2017 azu
import * as React from "react";
import { SyntheticEvent } from "react";
import { SearchResultList } from "../../project/SearchResultList/SearchResultList";
import { GitHubSearchStreamState } from "../../../store/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { BaseContainer } from "../BaseContainer";
import classNames from "classnames";
import { OpenItemInNewTabUseCase } from "../../../use-case/GitHubSearchStream/OpenItemInNewTabUseCase";

export interface GitHubSearchStreamContainerProps {
    className?: string;
    gitHubSearchStream: GitHubSearchStreamState
}

export class GitHubSearchStreamContainer extends BaseContainer<GitHubSearchStreamContainerProps, {}> {
    onClickItem = (event: SyntheticEvent<any>, item: GitHubSearchResultItem) => {
        event.preventDefault();
        if (process.env.RUNTIME_TARGET === "electron") {

        } else {
            this.useCase(new OpenItemInNewTabUseCase).execute(item.htmlUrl);
        }
    };

    render() {
        return <div className={classNames("GitHubSearchStreamContainer", this.props.className)}>
            <h1 className='ms-font-xxl'>Result</h1>
            <div className='GitHubSearchStreamContainer-main'>
                <SearchResultList items={this.props.gitHubSearchStream.items} onClickItem={this.onClickItem}/>
            </div>
        </div>
    }
}