import * as React from "react";
import { NoticeState } from "../../../store/Notice/NoticeStore";
import { Dialog, DialogFooter, DialogType, PrimaryButton } from "office-ui-fabric-react";
import { GenericErrorNotice } from "../../../domain/Notice/GenericErrorNotice";
import { BaseContainer } from "../BaseContainer";
import { EditQueryPanelUseCase } from "../../../use-case/GitHubSearchList/ToggleQueryPanelUseCase";
import { SearchQueryErrorNotice } from "../../../domain/Notice/SearchQueryErrorNotice";
import { createDismissErrorNoticeUseCase } from "../../../use-case/Notice/DismissErrorNoticeUseCase";
import { Notice } from "../../../domain/Notice/Notice";

export interface ErrorContainerProps {
    notice: NoticeState;
}

export class ErrorContainer extends BaseContainer<ErrorContainerProps, {}> {
    onDismiss = () => {
        const errorNotice = this.props.notice.errorNotice;
        if (errorNotice) {
            this.useCase(createDismissErrorNoticeUseCase()).execute(errorNotice);
        }
    };

    render() {
        const messsage = this._makeMessage(this.props.notice.errorNotice);
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
                {messsage}
            </Dialog>
        );
    }

    private _makeMessage(notice?: Notice) {
        if (!notice) {
            return null;
        }
        if (notice instanceof SearchQueryErrorNotice) {
            return this._makeSearchQueryErrorNotice(notice);
        } else if (notice instanceof GenericErrorNotice) {
            return this._makeGenericErrorNotice(notice);
        }
        return null;
    }

    private _makeGenericErrorNotice(genericErrorNotice?: GenericErrorNotice) {
        if (!genericErrorNotice) {
            return null;
        }
        const onClick = () => {
            this.onDismiss();
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

    private _makeSearchQueryErrorNotice(searchQueryErrorNotice?: SearchQueryErrorNotice) {
        if (!searchQueryErrorNotice) {
            return null;
        }
        const onClick = () => {
            this.onDismiss();
            this.useCase(new EditQueryPanelUseCase()).execute(searchQueryErrorNotice.query);
        };
        return (
            <div className="ErrorContainer-genericErrorNotice">
                {searchQueryErrorNotice.error.message}
                <DialogFooter>
                    <PrimaryButton onClick={onClick} text="OK" />
                </DialogFooter>
            </div>
        );
    }
}
