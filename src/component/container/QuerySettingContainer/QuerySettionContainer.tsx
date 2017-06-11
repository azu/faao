// MIT © 2017 azu
import * as React from "react";
import { BaseContainer } from "../BaseContainer";
import { GitHubSettingState } from "../../../store/GitHubSettingStore/GitHubSettingStore";
import { QuerySettingPanel } from "../../project/QuerySettingPanel/QuerySettingPanel";
import { GitHubSearchQueryJSON } from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchListState } from "../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { CloseQueryPanelUseCase } from "../../../use-case/GitHubSearchList/ToggleQueryPanelUseCase";
import { createSaveQueryToSearchListUseCase } from "../../../use-case/App/SaveQueryToSearchListUseCase";
import { createUpdateQueryToSearchListUseCase } from "../../../use-case/App/UpdateQueryToSearchListUseCase";

export interface QuickIssueContainerProps {
    gitHubSearchList: GitHubSearchListState;
    gitHubSetting: GitHubSettingState;
}

export class QuerySettingContainer extends BaseContainer<QuickIssueContainerProps, {}> {
    onDismiss = () => {
        this.useCase(new CloseQueryPanelUseCase()).executor(useCase => useCase.execute());
    };

    onSubmit = async (queryJSON: GitHubSearchQueryJSON) => {
        try {
            if (this.props.gitHubSearchList.editingQuery) {
                await this.useCase(createUpdateQueryToSearchListUseCase()).executor(useCase => {
                    return useCase.execute(
                        queryJSON,
                        this.props.gitHubSearchList.editingQueryIndex
                    );
                });
            } else {
                await this.useCase(createSaveQueryToSearchListUseCase()).executor(useCase =>
                    useCase.execute(queryJSON)
                );
            }
        } finally {
            await this.useCase(new CloseQueryPanelUseCase()).executor(useCase => useCase.execute());
        }
    };

    render() {
        return (
            <QuerySettingPanel
                isOpen={this.props.gitHubSearchList.isOpenAddingPanel}
                query={this.props.gitHubSearchList.editingQuery}
                onDismiss={this.onDismiss}
                onSubmit={this.onSubmit}
                settings={this.props.gitHubSetting.settings}
            />
        );
    }
}
