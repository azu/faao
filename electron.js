"use strict";
const path = require("path");
const { app, BrowserWindow } = require('electron');
const URL = process.env.FAAO_URL || "https://azu.github.io/faao/";
// context-menu for window
require('electron-context-menu')();
// Standard stuff
app.on("gpu-process-crashed", (event) => {
    console.log("gpu-process-crashed", event);
});
app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            javascript: true,
            plugins: true,
            nodeIntegration: true,
            webviewTag: true
        }
    });
    mainWindow.maximize();
    mainWindow.loadURL(URL);
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