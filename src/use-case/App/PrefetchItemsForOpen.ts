// MIT © 2017 azu

import { UseCase } from "almin";
import isElectron from "is-electron";

const debug = require("debug")("faao:PrefetchItemsForOpen");
export function prefetch(url: string) {
    if (isElectron()) {
        const { ipcRenderer } = (window as any).require("electron");
        ipcRenderer.send("browser-view-prefetch", url);
    } else {
        console.warn("Can not prefetch, because this env has not ipc");
    }
}

export class PrefetchItemsForOpen extends UseCase {
    execute(urlList: string[]) {
        debug("Prefetching...", urlList);
        urlList.forEach(url => {
            prefetch(url);
        });
    }
}
