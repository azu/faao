// MIT © 2017 azu

import { UseCase } from "almin";

const { ipcRenderer } = (window as any).require("electron");

export function prefetch(url: string) {
    if (ipcRenderer) {
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
