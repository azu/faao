// MIT © 2017 azu

import { UseCase } from "almin";
import isElectron from "is-electron";

export function openPage(url: string) {
    if (isElectron()) {
        const { ipcRenderer } = (window as any).require("electron");
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
