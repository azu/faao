// MIT © 2017 azu
import * as React from "react";
import classNames from "classnames";
import { BaseContainer } from "../BaseContainer";
import {
    CloseMobileMenuUseCase,
    OpenMobileMenuUseCase
} from "../../../use-case/Mobile/ToggleMobileMenuUseCase";
import { MobileState } from "../../../store/Mobile/MobileStore";
import { appLocator } from "../../../AppLocator";
import { DispatcherPayloadMeta } from "almin";

export interface AppMobileNavProps {
    className?: string;
    mobile: MobileState;
}

export class AppMobileNav extends BaseContainer<AppMobileNavProps, {}> {
    unSubscribe: () => void;
    onClickMenuButton = () => {
        if (this.props.mobile.isMenuOpened) {
            return this.useCase(new CloseMobileMenuUseCase())
                .executor(useCase => useCase.execute())
                .then(() => {
                    this.unSubscribeMenuUseCase();
                });
        } else {
            return this.useCase(new OpenMobileMenuUseCase())
                .executor(useCase => useCase.execute())
                .then(() => {
                    this.subscribeMenuUseCase();
                });
        }
    };

    subscribeMenuUseCase() {
        this.unSubscribe = appLocator.context.onDidExecuteEachUseCase(
            (_payload, _meta: DispatcherPayloadMeta) => {
                this.unSubscribe();
                this.useCase(new CloseMobileMenuUseCase()).executor(useCase => useCase.execute());
            }
        );
    }

    unSubscribeMenuUseCase() {
        if (typeof this.unSubscribe === "function") this.unSubscribe();
    }

    render() {
        const iconClassName = this.props.mobile.isMenuOpened ? "ChromeClose" : "GlobalNavButton";
        return (
            <div className={classNames("AppMobileNav", this.props.className)}>
                <button className="AppMobileNav-menuButton" onClick={this.onClickMenuButton}>
                    <i className={`ms-Icon ms-Icon--${iconClassName}`} />
                </button>
                <h1 className="AppMobileNav-title">Faao</h1>
            </div>
        );
    }
}
