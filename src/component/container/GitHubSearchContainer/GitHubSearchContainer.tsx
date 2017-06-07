// MIT © 2017 azu
import * as React from "react";
import { GitHubSearchListState } from "../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { SearchQueryList } from "../../project/SearchQueryList/SearchQueryList";
import { GitHubSearchQuery } from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { SyntheticEvent } from "react";
import { BaseContainer } from "../BaseContainer";
import { createSearchGitHubAndOpenStreamUseCase } from "../../../use-case/GitHubSearchList/SearchGitHubAndOpenStreamUseCase";
import classNames from "classnames";
import { CommandBar, IconButton, Label } from "office-ui-fabric-react";
import { OpenQuickIssueUseCase } from "../../../use-case/QuickIssue/OpenQuickIssueUseCase";
import { OpenQueryPanelUseCase } from "../../../use-case/GitHubSearchList/ToggleQueryPanelUseCase";

export interface GitHubSearchContainerProps {
    className?: string;
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
                return this.useCase(new OpenQuickIssueUseCase()).executor(useCase => useCase.execute());
            }
        }
    ];

    onClickQuery = (_event: SyntheticEvent<any>, query: GitHubSearchQuery) => {
        this.useCase(createSearchGitHubAndOpenStreamUseCase()).executor(useCase => useCase.execute(query));
    };

    onEditQuery = (_event: SyntheticEvent<any>, query: GitHubSearchQuery) => {
        this.useCase(new OpenQueryPanelUseCase()).executor(useCase => useCase.execute(query));
    };

    onClickAddingQuery = () => {
        this.useCase(new OpenQueryPanelUseCase()).executor(useCase => useCase.execute());
    };

    render() {
        return (
            <div className={classNames("GitHubSearchContainer", this.props.className)}>
                <header className="GitHubSearchContainer-header">
                    <CommandBar isSearchBoxVisible={false} items={this.menuItems} />
                </header>
                <div className="GitHubSearchContainer-main">
                    <h1 className="ms-font-xxl">
                        Queries
                        <IconButton
                            iconProps={{ iconName: "Add" }}
                            title="Add query"
                            ariaLabel="Add query"
                            onClick={this.onClickAddingQuery}
                        />
                    </h1>
                    <SearchQueryList
                        queries={this.props.gitHubSearchList.queries}
                        onClickQuery={this.onClickQuery}
                        onEditQuery={this.onEditQuery}
                    />
                </div>
            </div>
        );
    }
}
