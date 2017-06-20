"use strict";
const path = require("path");
const { app, BrowserWindow } = require('electron');
const URL = process.env.FAAO_URL || "http://localhost:8080/";
// context-menu for window
require('electron-context-menu')();
// Standard stuff
app.on("gpu-process-crashed", (event) => {
    console.log("gpu-process-crashed", event);
});
app.on('ready', () => {
    const mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.maximize();
    mainWindow.loadURL(URL);
});