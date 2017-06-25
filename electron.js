"use strict";
const url = require("url");
const { Menu, app, shell, BrowserWindow } = require('electron');
const defaultMenu = require('electron-default-menu');
const URL = process.env.FAAO_URL || "https://azu.github.io/faao/";
// context-menu for window
require('electron-context-menu')();
// Standard stuff
app.on("gpu-process-crashed", (event) => {
    console.log("gpu-process-crashed", event);
});
app.on('ready', () => {
    const menu = defaultMenu(app, shell);
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
    // browser-window
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            javascript: true,
            plugins: true,
            nodeIntegration: true,  // We will disable this?
            nativeWindowOpen: true,
            webviewTag: true
        }
    });
    mainWindow.maximize();
    mainWindow.loadURL(URL);

    // prevent navigation in main webview
    mainWindow.webContents.once('dom-ready', function(e) {
        mainWindow.webContents.on('will-navigate', (event, URL) => {
            const { protocol, hostname } = url.parse(URL);
            if (protocol === "http:" || protocol === "https:") {
                if (hostname === "localhost") {
                    return;
                }
                event.preventDefault();
                shell.openExternal(URL);
                console.log("Stop navigation:" + URL);
            }
        });
    });
});
// https://github.com/electron/electron/blob/master/docs/tutorial/security.md#checklist
app.on('web-contents-created', (event, contents) => {
    contents.on('will-attach-webview', (event, webPreferences, params) => {
        // Strip away preload scripts if unused or verify their location is legitimate
        delete webPreferences.preload;
        delete webPreferences.preloadURL;
        // Disable node integration
        webPreferences.nodeIntegration = false;
    });
});