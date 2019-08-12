import { URL } from "url";
import * as path from "path";

import { app, ipcMain, BrowserWindow, Menu, shell } from "electron";
import { ViewPool } from "./ViewPool";

/**
 * get url for loading BrowserWindow
 * @returns {string}
 */
const getHTMLUrl = () => {
    if (process.env.FAAO_URL) {
        return process.env.FAAO_URL;
    }
    // build/main-src -> ../index.html
    return `file://${path.join(__dirname, "../index.html")}`;
};
const htmlURL = getHTMLUrl();
let viewPool: ViewPool;
let mainWindow: BrowserWindow;
if (process.env.NODE_ENV !== "production") {
    console.info(`Open: ${htmlURL}`);
}
// context-menu for window
require("electron-context-menu")();
// url schema: faoo://
app.setAsDefaultProtocolClient("faao");
// Standard stuff
app.on("gpu-process-crashed", (event: any) => {
    console.log("gpu-process-crashed", event);
});
app.on("ready", () => {
    // browser-window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            javascript: true,
            plugins: true,
            nodeIntegration: true, // We will disable this?
            nativeWindowOpen: true,
            webviewTag: false
        }
    });
    mainWindow.maximize();
    mainWindow.loadURL(htmlURL);
    // prevent navigation in main webview
    mainWindow.webContents.once("dom-ready", function(_event) {
        mainWindow.webContents.on("will-navigate", (event, url) => {
            const { protocol, hostname } = new URL(url);
            if (protocol === "http:" || protocol === "https:") {
                if (hostname === "localhost") {
                    return;
                }
                event.preventDefault();
                shell.openExternal(url);
                console.info("Stop navigation:" + url);
            }
        });
    });
    // View Pool redirect
    viewPool = new ViewPool(mainWindow, 8);
    viewPool.on("will-navigate", (url: string) => {
        mainWindow.webContents.send("browser-view-will-navigate", url);
    });
});

app.on("open-url", function(event, openedUrl) {
    event.preventDefault();

    function queryToArgs(urlString: string) {
        if (!urlString) {
            return {
                url: null
            };
        }
        const { searchParams, pathname } = new URL(urlString);
        return {
            pathname,
            url: searchParams.get("url"),
            query: searchParams.get("query")
        };
    }

    const passUrlToBrowser = (openedUrl: string) => {
        const { url, query, pathname } = queryToArgs(openedUrl);
        if (pathname === "query/add") {
            if (url && query && mainWindow && mainWindow.webContents) {
                mainWindow.webContents.send("faao-add-url-to-query", url, query);
            }
        }
    };
    if (!app.isReady()) {
        app.once("ready", () => {
            passUrlToBrowser(openedUrl);
        });
    } else {
        passUrlToBrowser(openedUrl);
    }
});
let _size: any;
ipcMain.on("browser-view-change-size", (_event: any, size: Size) => {
    viewPool.setBounds(size);
    _size = size;
});

ipcMain.on("browser-view-load-url", async (_event: any, url: string) => {
    console.log("load url", url);
    const view = await viewPool.open(url);
    console.log("view", view.webContents.getURL());
    viewPool.bringFrontBrowserView(view);
});

ipcMain.on("browser-view-prefetch", (_event: any, url: string) => {
    viewPool.prefetch(url).then(() => {
        // ipcMain.emit("browser-view-prefetched", url);
    });
});

ipcMain.on("browser-view-show", () => {
    viewPool.show();
});

ipcMain.on("browser-view-hide", () => {
    viewPool.hide();
});

ipcMain.on("browser-view-reload", () => {
    viewPool.reloadCurrentBrowserView();
});
ipcMain.on("browser-view-go-back", () => {
    viewPool.goBackCurrentBrowserView();
});
ipcMain.on("browser-view-go-forward", () => {
    viewPool.goForwardCurrentBrowserView();
});

interface Size {
    x: number;
    y: number;
    width: number;
    height: number;
}

// https://github.com/electron/electron/blob/master/docs/tutorial/security.md#checklist
app.on("web-contents-created", (_event, contents) => {
    contents.on("will-attach-webview", (_event, webPreferences, _params) => {
        // Strip away preload scripts if unused or verify their location is legitimate
        delete webPreferences.preload;
        delete webPreferences.preloadURL;
        // Disable node integration
        webPreferences.nodeIntegration = false;
    });
});
