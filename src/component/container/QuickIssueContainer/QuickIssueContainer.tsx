// MIT © 2017 azu
import * as React from "react";
import { BaseContainer } from "../BaseContainer";
import { QuickIssuePanel } from "../../project/QuickIssuePanel/QuickIssuePanel";
import { QuickIssueState } from "../../../store/QuickIssueStore/QuickIssueStore";
import { OpenGitHubIssueUseCase } from "../../../use-case/QuickIssue/OpenGitHubIssueUseCase";
import { CloseQuickIssueUseCase } from "../../../use-case/QuickIssue/CloseQuickIssueUseCase";

export interface QuickIssueContainerProps {
    quickIssue: QuickIssueState;
}

export class QuickIssueContainer extends BaseContainer<QuickIssueContainerProps, {}> {
    onDismiss = () => {
        this.useCase(new CloseQuickIssueUseCase()).executor(useCase => useCase.execute());
    };

    onSubmit = (issueURL: string, title: string, body: string) => {
        this.useCase(new OpenGitHubIssueUseCase()).executor(useCase => {
            return useCase.execute(issueURL, title, body);
        });
    };

    render() {
        return (
            <QuickIssuePanel
                isOpen={this.props.quickIssue.isOpened}
                newIssueURLs={this.props.quickIssue.newIssueURLs}
                onDismiss={this.onDismiss}
                onSubmit={this.onSubmit}
            />
        );
    }
}
