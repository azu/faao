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
import { GitHubSearchList } from "../../../../domain/GitHubSearchList/GitHubSearchList";
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

    onClickQuery = (_event: SyntheticEvent<any>, query: GitHubSearchQuery) => {
        this.useCase(createSearchQueryAndOpenStreamUseCase())
            .executor(useCase => useCase.execute(query))
            .catch((error: Error) => {
                console.error("onClickQuery", error);
            });
    };

    onEditQuery = (_event: SyntheticEvent<any>, query: GitHubSearchQuery) => {
        this.useCase(new EditQueryPanelUseCase()).executor(useCase => useCase.execute(query));
    };

    onDeleteQuery = (_event: SyntheticEvent<any>, query: GitHubSearchQuery) => {
        this.useCase(createDeleteQueryUseCase()).executor(useCase => useCase.execute(query));
    };

    onClickAddingQuery = (_event: SyntheticEvent<any>, searchList: GitHubSearchList) => {
        this.useCase(new OpenQueryPanelUseCase()).executor(useCase => useCase.execute(searchList));
    };

    onClickSearchList = (_event: SyntheticEvent<any>, searchList: GitHubSearchList) => {
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
                    onClickAddingQuery={this.onClickAddingQuery}
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
