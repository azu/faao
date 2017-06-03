"use strict";
const path = require("path");
const { app, BrowserWindow } = require('electron');
if (process.env.NODE_ENV !== "production") {
    require('electron-reload')(path.join(__dirname, "public/**/*"));
}
// Standard stuff
app.on('ready', () => {
    const mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadURL(`file://${__dirname}/public/electron.html`);
});