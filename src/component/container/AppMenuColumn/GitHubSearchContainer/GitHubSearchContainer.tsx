// MIT © 2017 azu
import * as React from "react";
import { SyntheticEvent } from "react";
import { GitHubSearchListState } from "../../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { SearchQueryList } from "../../../project/SearchQueryList/SearchQueryList";
import { GitHubSearchQuery } from "../../../../domain/GitHubSearchList/GitHubSearchQuery";
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
import { GitHubSearchList, UnionQuery } from "../../../../domain/GitHubSearchList/GitHubSearchList";
import { createSearchQueriesAndOpenStreamUseCase } from "../../../../use-case/GitHubSearchList/SearchQueriesAndOpenStreamUseCase";
import { AppState } from "../../../../store/AppStore/AppStore";

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
                return this.useCase(new OpenQuickIssueUseCase()).executor(useCase =>
                    useCase.execute()
                );
            }
        }
    ];

    onClickQuery = (query: UnionQuery) => {
        this.useCase(createSearchQueryAndOpenStreamUseCase())
            .executor(useCase => useCase.execute(query))
            .catch((error: Error) => {
                console.error("onClickQuery", error);
            });
    };

    onEditQuery = (query: UnionQuery) => {
        this.useCase(new EditQueryPanelUseCase()).executor(useCase => useCase.execute(query));
    };

    onDeleteQuery = (query: UnionQuery) => {
        this.useCase(createDeleteQueryUseCase()).executor(useCase => useCase.execute(query));
    };

    onClickAddingGitHubQuery = (searchList: GitHubSearchList) => {
        this.useCase(new OpenQueryPanelUseCase()).executor(useCase =>
            useCase.execute(searchList, "github")
        );
    };

    onClickAddingFaaoQuery = (searchList: GitHubSearchList) => {
        this.useCase(new OpenQueryPanelUseCase()).executor(useCase =>
            useCase.execute(searchList, "faao")
        );
    };

    onClickSearchList = (searchList: GitHubSearchList) => {
        this.useCase(createSearchQueriesAndOpenStreamUseCase()).executor(useCase =>
            useCase.execute(searchList)
        );
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
