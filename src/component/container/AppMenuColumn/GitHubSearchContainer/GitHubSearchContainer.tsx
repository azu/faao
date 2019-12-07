// MIT © 2017 azu
import * as React from "react";
import { GitHubSearchListState } from "../../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { SearchQueryList } from "../../../project/SearchQueryList/SearchQueryList";
import { BaseContainer } from "../../BaseContainer";
import { createSearchQueryAndOpenStreamUseCase } from "../../../../use-case/GitHubSearchList/SearchQueryAndOpenStreamUseCase";
import classNames from "classnames";
import { OpenQuickIssueUseCase } from "../../../../use-case/QuickIssue/OpenQuickIssueUseCase";
import {
    EditQueryPanelUseCase,
    OpenQueryPanelUseCase
} from "../../../../use-case/GitHubSearchList/ToggleQueryPanelUseCase";
import { GitHubSettingState } from "../../../../store/GitHubSettingStore/GitHubSettingStore";
import { createDeleteQueryUseCase } from "../../../../use-case/GitHubSearchList/DeleteQueryUseCase";
import { GitHubSearchList } from "../../../../domain/GitHubSearchList/GitHubSearchList";
import { createSearchQueriesAndOpenStreamUseCase } from "../../../../use-case/GitHubSearchList/SearchQueriesAndOpenStreamUseCase";
import { AppState } from "../../../../store/AppStore/AppStore";
import { UnionQuery } from "../../../../domain/GitHubSearchList/queries/QueryRole";

export interface GitHubSearchContainerProps {
    className?: string;
    app: AppState;
    gitHubSetting: GitHubSettingState;
    gitHubSearchList: GitHubSearchListState;
}

export class GitHubSearchContainer extends BaseContainer<GitHubSearchContainerProps, {}> {
    menuItems = [
        {
            key: "newItem",
            name: "Quick Issue",
            icon: "EditMirrored",
            ariaLabel: "Quick New Issue",
            onClick: () => {
                return this.useCase(new OpenQuickIssueUseCase()).execute();
            }
        }
    ];

    onClickQuery = (query: UnionQuery) => {
        this.useCase(createSearchQueryAndOpenStreamUseCase())
            .execute(query)
            .catch((error: Error) => {
                console.error("onClickQuery", error);
            });
    };

    onEditQuery = (query: UnionQuery) => {
        this.useCase(new EditQueryPanelUseCase()).execute(query);
    };

    onDeleteQuery = (query: UnionQuery) => {
        this.useCase(createDeleteQueryUseCase()).execute(query);
    };

    onClickAddingGitHubQuery = (searchList: GitHubSearchList) => {
        this.useCase(new OpenQueryPanelUseCase()).execute(searchList, "github");
    };

    onClickAddingFaaoQuery = (searchList: GitHubSearchList) => {
        this.useCase(new OpenQueryPanelUseCase()).execute(searchList, "faao");
    };

    onClickSearchList = (searchList: GitHubSearchList) => {
        this.useCase(createSearchQueriesAndOpenStreamUseCase()).execute(searchList);
    };

    render() {
        const searchQueryList = this.props.gitHubSearchList.searchLists.map(searchList => {
            return (
                <SearchQueryList
                    key={searchList.id.toValue()}
                    searchList={searchList}
                    activeSearchList={this.props.app.activeSearchList}
                    activeQuery={this.props.app.activeQuery}
                    onClickSearchList={this.onClickSearchList}
                    onClickAddingGitHubQuery={this.onClickAddingGitHubQuery}
                    onClickAddingFaaoQuery={this.onClickAddingFaaoQuery}
                    onClickQuery={this.onClickQuery}
                    onEditQuery={this.onEditQuery}
                    onDeleteQuery={this.onDeleteQuery}
                />
            );
        });
        return (
            <div className={classNames("GitHubSearchContainer", this.props.className)}>
                {searchQueryList}
            </div>
        );
    }
}
