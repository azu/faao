// MIT © 2017 azu

import { UseCase } from "almin";

export interface ElectronNavigation {
    newTab(url: string, options?: object): void;

    changeTab(url: string, options?: object): void;

    stop(): void;
}

// extends
declare global {
    interface Window {
        electronNavigation?: ElectronNavigation;
    }
}

export function openURLInTab(url: string) {
    if (window.electronNavigation) {
        window.electronNavigation.changeTab(url);
    }
}

export function openPage(url: string) {
    if (window.electronNavigation) {
        window.electronNavigation.changeTab(url);
    } else {
        window.open(url, "_faao");
    }
}

export class OpenItemInNewTabUseCase extends UseCase {
    execute(url: string) {
        openPage(url);
    }
}
