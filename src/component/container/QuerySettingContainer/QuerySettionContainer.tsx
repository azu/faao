// MIT © 2017 azu
import * as React from "react";
import { BaseContainer } from "../BaseContainer";
import { GitHubSettingState } from "../../../store/GitHubSettingStore/GitHubSettingStore";
import { QuerySettingPanel } from "../../project/QuerySettingPanel/QuerySettingPanel";
import { GitHubSearchQueryJSON } from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { createAddQueryToSearchListUseCase } from "../../../use-case/App/AppUserAddQueryUseCase";

export interface QuickIssueContainerProps {
    gitHubSetting: GitHubSettingState;
}

export class QuerySettingContainer extends BaseContainer<QuickIssueContainerProps, {}> {

    onDismiss = () => {
    };

    onSubmit = (queryJSON: GitHubSearchQueryJSON) => {
        this.useCase(createAddQueryToSearchListUseCase()).executor(useCase => useCase.execute(queryJSON));
    };

    render() {
        return <QuerySettingPanel
            isOpen={true}
            onDismiss={this.onDismiss}
            onSubmit={this.onSubmit}
            settings={this.props.gitHubSetting.settings}
        />
    }
}