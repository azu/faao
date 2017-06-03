// MIT © 2017 azu

import { UseCase } from "almin";
import throttle from "lodash.throttle";

export declare interface ElectronNavigation {
    newTab(url: string, options?: object): void;

    changeTab(url: string, options?: object): void;

    stop(): void;
}

// extends
declare global {
    interface Window {
        electronNavigation?: ElectronNavigation
    }
}

export function openPage(url: string) {
    console.log("open", url);
    if (window.electronNavigation) {
        window.electronNavigation.changeTab(url);
    } else {
        window.open(url, "_faao");
    }
}
// prevent GPU crash on webview
const throttledOpenPage = throttle(openPage, 100);

export class OpenItemInNewTabUseCase extends UseCase {
    execute(url: string) {
        throttledOpenPage(url);
    }
}