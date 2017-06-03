"use strict";
const path = require("path");
const { app, BrowserWindow } = require('electron');
// Standard stuff
app.on("gpu-process-crashed", (event) => {
    console.log("gpu-process-crashed", event);
});
app.on('ready', () => {
    const mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.maximize();
    mainWindow.loadURL(`file://${__dirname}/public/electron.html`);
});