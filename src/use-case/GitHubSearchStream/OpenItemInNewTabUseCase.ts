// MIT © 2017 azu

import { UseCase } from "almin";

export declare interface ElectronNavigation {
    newTab(url: string, options?: object): void;
    changeTab(url: string, options?: object): void;
}
// extends
declare global {
    interface Window {
        electronNavigation?: ElectronNavigation
    }
}

export class OpenItemInNewTabUseCase extends UseCase {
    execute(url: string) {
        if (window.electronNavigation) {
            window.electronNavigation.changeTab(url);
        } else {
            window.open(url, "_faao");
        }
    }
}