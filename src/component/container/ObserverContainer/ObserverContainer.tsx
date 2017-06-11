// MIT © 2017 azu
import * as React from "react";
import { BaseContainer } from "../BaseContainer";
import { createUpdateAppNetworkStatusUseCase } from "../../../use-case/App/UpdateAppNetworkStatusUseCase";
import { AppNetworkStatus } from "../../../domain/App/AppNetwork";

export class ObserverContainer extends BaseContainer<{}, {}> {
    onOnlineStatus = () => {
        const networkStatus: AppNetworkStatus = typeof navigator !== "undefined"
            ? navigator.onLine ? "online" : "offline"
            : "online";
        this.useCase(createUpdateAppNetworkStatusUseCase()).executor(useCase =>
            useCase.execute(networkStatus)
        );
    };

    componentDidMount() {
        window.addEventListener("online", this.onOnlineStatus);
        window.addEventListener("offline", this.onOnlineStatus);
    }

    render() {
        return null;
    }
}
