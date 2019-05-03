// MIT © 2017 azu

import { UseCase } from "almin";
import isElectron from "is-electron";

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
        console.log("prefetching...", urlList);
        urlList.forEach(url => {
            prefetch(url);
        });
    }
}
