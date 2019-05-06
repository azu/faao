import * as React from "react";
import { NoticeState } from "../../../store/Notice/NoticeStore";
import { Dialog, DialogFooter, DialogType, PrimaryButton } from "office-ui-fabric-react";
import { GenericErrorNotice } from "../../../domain/Notice/GenericErrorNotice";
import { BaseContainer } from "../BaseContainer";
import { EditQueryPanelUseCase } from "../../../use-case/GitHubSearchList/ToggleQueryPanelUseCase";
import { SearchQueryErrorNotice } from "../../../domain/Notice/SearchQueryErrorNotice";
import { createDismissNoticeUseCase } from "../../../use-case/Notice/DismissNoticeUseCase";
import { Notice } from "../../../domain/Notice/Notice";
import { OSNotice } from "../../../domain/Notice/OSNotice";
import { shallowEqual } from "shallow-equal-object";
import isElectron from "is-electron";
import { createAppUserOpenStreamWithItemUseCase } from "../../../use-case/App/AppUserOpenStreamWithItemUseCase";
import { createDismissNoticesUseCase } from "../../../use-case/Notice/DismissNoticesUseCase";

const debug = require("debug")("faao:ErrorContainer");
const showOSNotifications = (notices: OSNotice[], onClick: (notice: OSNotice) => void) => {
    if (!isElectron()) {
        return Promise.resolve();
    }
    const Notification: typeof import("electron").Notification = (window as any).require("electron")
        .remote.Notification;
    const nativeImage: typeof import("electron").nativeImage = (window as any).require("electron")
        .remote.nativeImage;
    const promises = notices.map(async notice => {
        return new Promise(async resolve => {
            if (notice.icon) {
                const imageBase64 = await fetch(notice.icon)
                    .then(r => r.arrayBuffer())
                    .then(buf => {
                        const base64String = btoa(String.fromCharCode(...new Uint8Array(buf)));
                        return `data:image/png;base64,` + base64String;
                    });
                const image = nativeImage.createFromDataURL(imageBase64);
                const notification = new Notification({
                    title: notice.title,
                    subtitle: notice.subTitle,
                    body: notice.body,
                    icon: image
                });
                notification.addListener("click", () => {
                    onClick(notice);
                    resolve();
                });
                // > This event is not guaranteed to be emitted in all cases where the notification is closed.
                notification.addListener("show", () => {
                    // Automatically
                    setTimeout(() => {
                        resolve();
                    }, 60 * 1000);
                });
                notification.show();
            } else {
                resolve();
            }
        });
    });
    return Promise.all(promises).then(results => {
        debug("resolve all notifications: %d", results.length);
    });
};

export interface ErrorContainerProps {
    notice: NoticeState;
}

export class ErrorContainer extends BaseContainer<ErrorContainerProps, {}> {
    onDismiss = () => {
        const errorNotice = this.props.notice.errorNotice;
        if (errorNotice) {
            this.useCase(createDismissNoticeUseCase()).execute(errorNotice);
        }
    };
    // click "Notification" and open item
    private onClickNotification = (notice: OSNotice) => {
        this.useCase(createAppUserOpenStreamWithItemUseCase()).execute(
            notice.refs.query,
            notice.refs.item
        );
    };

    componentDidUpdate(prevProps: Readonly<ErrorContainerProps>): void {
        const currentOSNotices = this.props.notice.osNotices;
        if (!shallowEqual(prevProps.notice.osNotices, currentOSNotices)) {
            showOSNotifications(currentOSNotices, this.onClickNotification).then(() => {
                this.useCase(createDismissNoticesUseCase()).execute(currentOSNotices);
            });
        }
    }

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
