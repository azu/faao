// MIT © 2017 azu
import * as React from "react";
import { SyntheticEvent } from "react";
import { SearchResultList } from "../../project/SearchResultList/SearchResultList";
import { GitHubSearchStreamState } from "../../../store/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchResultItem } from "../../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { BaseContainer } from "../BaseContainer";
import classNames from "classnames";
import { OpenItemInNewTabUseCase } from "../../../use-case/GitHubSearchStream/OpenItemInNewTabUseCase";
import { AppState } from "../../../store/AppStore/AppStore";
import { createAppUserOpenItemUseCase } from "../../../use-case/App/AppUserOpenItemUseCase";

export interface GitHubSearchStreamContainerProps {
    className?: string;
    gitHubSearchStream: GitHubSearchStreamState
    app: AppState;
}

export class GitHubSearchStreamContainer extends BaseContainer<GitHubSearchStreamContainerProps, {}> {
    onClickItem = (event: SyntheticEvent<any>, item: GitHubSearchResultItem) => {
        event.preventDefault();
        this.useCase(createAppUserOpenItemUseCase()).executor(useCase => useCase.execute(item));
    };

    render() {
        return <div className={classNames("GitHubSearchStreamContainer", this.props.className)}>
            <h1 className='ms-font-xxl GitHubSearchStreamContainer-title'>Result</h1>
            <div className='GitHubSearchStreamContainer-main'>
                <SearchResultList
                    className="GitHubSearchStreamContainer-list"
                    items={this.props.gitHubSearchStream.items}
                    activeItem={this.props.app.activeItem}
                    onClickItem={this.onClickItem}/>
            </div>
        </div>
    }
}