import * as url from "url";
import * as path from "path";

import { app, ipcMain, BrowserWindow, Menu, shell } from "electron";
import { ViewPool } from "./ViewPool";

const defaultMenu = require("electron-default-menu");
/**
 * get url for loading BrowserWindow
 * @returns {string}
 */
const getHTMLUrl = () => {
    if (process.env.FAAO_URL) {
        return process.env.FAAO_URL;
    }
    const useRemote = process.argv.indexOf("--use-remote") !== -1;
    if (useRemote) {
        return "https://azu.github.io/faao/";
    }
    return `file://${path.join(__dirname, "../build/index.html")}`;
};
const URL = getHTMLUrl();
let viewPool: ViewPool;
let mainWindow: BrowserWindow;
if (process.env.NODE_ENV !== "production") {
    console.info(`Open: ${URL}`);
}
// context-menu for window
require("electron-context-menu")();
// Standard stuff
app.on("gpu-process-crashed", (event: any) => {
    console.log("gpu-process-crashed", event);
});
app.on("ready", () => {
    const menu = defaultMenu(app, shell);
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
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
    mainWindow.loadURL(URL);
    // prevent navigation in main webview
    mainWindow.webContents.once("dom-ready", function(_event) {
        mainWindow.webContents.on("will-navigate", (event, URL) => {
            const { protocol, hostname } = url.parse(URL);
            if (protocol === "http:" || protocol === "https:") {
                if (hostname === "localhost") {
                    return;
                }
                event.preventDefault();
                shell.openExternal(URL);
                console.info("Stop navigation:" + URL);
            }
        });
    });
    // View Pool redirect
    viewPool = new ViewPool(mainWindow, 8);
    viewPool.on("will-navigate", (url: string) => {
        mainWindow.webContents.send("browser-view-will-navigate", url);
    });
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
    viewPool.show(view);
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
