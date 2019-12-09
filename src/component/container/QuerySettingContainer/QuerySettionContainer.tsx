// MIT © 2017 azu
import * as React from "react";
import { BaseContainer } from "../BaseContainer";
import { GitHubSettingState } from "../../../store/GitHubSettingStore/GitHubSettingStore";
import { QuerySettingPanel } from "../../project/QuerySettingPanel/QuerySettingPanel";
import {
    GitHubSearchQueryJSON,
    isGitHubSearchQuery
} from "../../../domain/GitHubSearchList/queries/GitHubSearchQuery";
import { GitHubSearchListState } from "../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { CloseQueryPanelUseCase } from "../../../use-case/GitHubSearchList/ToggleQueryPanelUseCase";
import { createSaveQueryToSearchListUseCase } from "../../../use-case/GitHubSearchList/SaveQueryToSearchListUseCase";
import { createUpdateQueryToSearchListUseCase } from "../../../use-case/App/UpdateQueryToSearchListUseCase";
import { FaaoQuerySettingPanel } from "../../project/FaaoQuerySettingPanel/FaaoQuerySettingPanel";
import {
    FaaoSearchQueryJSON,
    isFaaoSearchQuery
} from "../../../domain/GitHubSearchList/queries/FaaoSearchQuery";
import {
    GitHubLikeQueryJSON,
    isGitHubLikeQuery
} from "../../../domain/GitHubSearchList/queries/QueryRole";

export interface QuickIssueContainerProps {
    gitHubSearchList: GitHubSearchListState;
    gitHubSetting: GitHubSettingState;
}

export class QuerySettingContainer extends BaseContainer<QuickIssueContainerProps, {}> {
    onDismiss = () => {
        this.useCase(new CloseQueryPanelUseCase()).execute();
    };

    onFaaoQuerySubmit = async (queryJSON: FaaoSearchQueryJSON) => {
        try {
            const editingQuery = this.props.gitHubSearchList.editingQuery;
            if (isFaaoSearchQuery(editingQuery)) {
                // edit query
                await this.useCase(createUpdateQueryToSearchListUseCase()).execute(
                    queryJSON,
                    editingQuery
                );
            } else if (this.props.gitHubSearchList.editingSearchList) {
                // add query
                await this.useCase(createSaveQueryToSearchListUseCase()).execute(
                    this.props.gitHubSearchList.editingSearchList!,
                    queryJSON
                );
            }
        } finally {
            await this.useCase(new CloseQueryPanelUseCase()).execute();
        }
    };

    onGitHubQuerySubmit = async (queryJSON: GitHubLikeQueryJSON) => {
        try {
            const editingQuery = this.props.gitHubSearchList.editingQuery;
            if (isGitHubLikeQuery(editingQuery)) {
                // edit query
                await this.useCase(createUpdateQueryToSearchListUseCase()).execute(
                    queryJSON,
                    editingQuery
                );
            } else if (this.props.gitHubSearchList.editingSearchList) {
                // add query
                await this.useCase(createSaveQueryToSearchListUseCase()).execute(
                    this.props.gitHubSearchList.editingSearchList!,
                    queryJSON
                );
            }
        } finally {
            await this.useCase(new CloseQueryPanelUseCase()).execute();
        }
    };

    render() {
        const editingQuery = this.props.gitHubSearchList.editingQuery;
        const openQueryPanelState = this.props.gitHubSearchList.openQueryPanelState;
        if (!this.props.gitHubSearchList.openQueryPanelState) {
            return null;
        }
        return (
            <>
                <QuerySettingPanel
                    isOpen={this.props.gitHubSearchList.openQueryPanelState === "github"}
                    query={isGitHubLikeQuery(editingQuery) ? editingQuery : undefined}
                    onDismiss={this.onDismiss}
                    onSubmit={this.onGitHubQuerySubmit}
                    settings={this.props.gitHubSetting.settings}
                />
                <FaaoQuerySettingPanel
                    isOpen={openQueryPanelState === "faao"}
                    query={isFaaoSearchQuery(editingQuery) ? editingQuery : undefined}
                    onDismiss={this.onDismiss}
                    onSubmit={this.onFaaoQuerySubmit}
                    settings={this.props.gitHubSetting.settings}
                />
            </>
        );
    }
}
