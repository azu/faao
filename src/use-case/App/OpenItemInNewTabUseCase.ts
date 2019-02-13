// MIT © 2017 azu

import { UseCase } from "almin";

export function openURLInTab(url: string) {
    if (window.electronNavigation) {
        window.electronNavigation.changeTab(url);
    }
}

const { ipcRenderer } = (window as any).require("electron");
export function openPage(url: string) {
    if (ipcRenderer) {
        ipcRenderer.send("browser-view-load-url", url);
    } else {
        window.open(url, "_faao");
    }
}

export class OpenItemInNewTabUseCase extends UseCase {
    execute(url: string) {
        openPage(url);
    }
}
