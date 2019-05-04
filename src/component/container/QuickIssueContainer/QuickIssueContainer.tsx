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
        this.useCase(new CloseQuickIssueUseCase()).execute();
    };

    onSubmit = async (issueURL: string, title: string, body: string) => {
        try {
            await this.useCase(new OpenGitHubIssueUseCase()).execute(issueURL, title, body);
        } finally {
            await this.useCase(new CloseQuickIssueUseCase()).execute();
        }
    };

    render() {
        if (!this.props.quickIssue.isOpened) {
            return null;
        }
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
