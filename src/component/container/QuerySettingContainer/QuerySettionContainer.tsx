// MIT © 2017 azu
import * as React from "react";
import { BaseContainer } from "../BaseContainer";
import { QuickIssuePanel } from "../../project/QuickIssuePanel/QuickIssuePanel";
import { QuickIssueState } from "../../../store/QuickIssueStore/QuickIssueStore";
import { OpenGitHubIssueUseCase } from "../../../use-case/QuickIssue/OpenGitHubIssueUseCase";
import { CloseQuickIssueUseCase } from "../../../use-case/QuickIssue/CloseQuickIssueUseCase";
import { GitHubSettingState } from "../../../store/GitHubSettingStore/GitHubSettingStore";
import { QuerySettingPanel } from "../../project/QuerySettingPanel/QuerySettingPanel";
import { GitHubSearchQueryJSON } from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";

export interface QuickIssueContainerProps {
    gitHubSetting: GitHubSettingState;
}

export class QuerySettingContainer extends BaseContainer<QuickIssueContainerProps, {}> {

    onDismiss = () => {
        this.useCase(new CloseQuickIssueUseCase()).executor(useCase => useCase.execute());
    };

    onSubmit = (queryJSON: GitHubSearchQueryJSON) => {
        console.log(queryJSON);
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