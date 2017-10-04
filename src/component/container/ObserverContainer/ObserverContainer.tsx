// MIT © 2017 azu
import * as React from "react";
import { BaseContainer } from "../BaseContainer";
import { createUpdateAppNetworkStatusUseCase } from "../../../use-case/App/UpdateAppNetworkStatusUseCase";
import { AppNetworkStatus } from "../../../domain/App/AppNetwork";
import { TimeScheduler } from "../../../infra/time-sheduler/TimeScheduler";
import { createReloadAllStreamUseCase } from "../../../use-case/GitHubSearchStream/ReloadAllStreamUseCase";

const debug = require("debug")("faao:ObserverContainer");
export class ObserverContainer extends BaseContainer<{}, {}> {
    timeScheduler: TimeScheduler;
    onOnlineStatus = () => {
        const networkStatus: AppNetworkStatus =
            typeof navigator !== "undefined" ? (navigator.onLine ? "online" : "offline") : "online";
        this.useCase(createUpdateAppNetworkStatusUseCase()).executor(useCase =>
            useCase.execute(networkStatus)
        );
    };

    onIntervalWork = () => {
        debug("try auto-reload");
        this.useCase(createReloadAllStreamUseCase()).executor(useCase => useCase.execute());
    };

    componentDidMount() {
        const AUTO_UPDATE_INTERVAL = 1000 * 120;
        this.timeScheduler = new TimeScheduler(this.onIntervalWork, AUTO_UPDATE_INTERVAL);
        this.timeScheduler.start();
        window.addEventListener("online", this.onOnlineStatus);
        window.addEventListener("offline", this.onOnlineStatus);
    }

    componentWillUnmount() {
        window.removeEventListener("online", this.onOnlineStatus);
        window.removeEventListener("offline", this.onOnlineStatus);
        this.timeScheduler.stop();
    }

    render() {
        return null;
    }
}
