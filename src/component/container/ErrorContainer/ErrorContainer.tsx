import * as React from "react";
import { NoticeState } from "../../../store/Notice/NoticeStore";
import {
    DefaultButton,
    Dialog,
    PrimaryButton,
    DialogFooter,
    DialogType,
    MessageBarType,
    MessageBar
} from "office-ui-fabric-react";
import { GenericErrorNotice } from "../../../domain/Notice/GenericErrorNotice";
import { BaseContainer } from "../BaseContainer";
import { OpenQueryPanelUseCase } from "../../../use-case/GitHubSearchList/ToggleQueryPanelUseCase";
import { SearchQueryErrorNotice } from "../../../domain/Notice/SearchQueryErrorNotice";
import { createDismissErrorNoticeUseCase } from "../../../use-case/Notice/DismissErrorNoticeUseCase";

export interface ErrorContainerProps {
    notice: NoticeState;
}

export class ErrorContainer extends BaseContainer<ErrorContainerProps, {}> {
    onDismiss = () => {
        if (this.notice !== undefined) {
            return this.useCase(createDismissErrorNoticeUseCase()).executor(useCase => useCase.execute(this.notice!));
        }
    };

    render() {
        return (
            <Dialog
                className="ErrorContainer"
                isOpen={this.props.notice.hasNotice}
                type={DialogType.normal}
                onDismiss={this.onDismiss}
                title="Error notices"
                isBlocking={false}
                containerClassName="ms-dialogMainOverride"
            >
                {this._makeErrorNotice(this.notice)}
            </Dialog>
        );
    }

    private get notice() {
        return this.props.notice.searchQueryErrorNotice;
    }

    private _makeErrorNotice(genericErrorNotice?: SearchQueryErrorNotice) {
        if (!genericErrorNotice) {
            return null;
        }
        const onClick = () => {
            this.onDismiss();
            this.useCase(new OpenQueryPanelUseCase()).executor(useCase => useCase.execute(genericErrorNotice.query));
        };
        return (
            <div className="ErrorContainer-genericErrorNotice">
                {genericErrorNotice.error.message}
                <DialogFooter>
                    <PrimaryButton onClick={onClick} text="OK" />
                </DialogFooter>
            </div>
        );
    }
}
