// MIT © 2017 azu
import isElectron from "is-electron";

export const initializeElectron = () => {
    if (!isElectron()) {
        return;
    }
    inject();
};

export function inject() {
    // body class="electron-view"
    document.body.classList.add("electron-view");
    const ElectronNavigation = require("electron-navigation");
    const anyWindow = window as any;
    anyWindow.electronNavigation = new ElectronNavigation();
    anyWindow.electronNavigation.newTab("https://github.com");
    window.addEventListener("load", () => {
        // const nav = document.querySelector(".electron-nav");
        const webview = document.querySelector("webview.nav-views-view");
        if (!webview) {
            throw new Error("webview not found");
        }
        const onFocusChange = function() {
            if (webview === document.activeElement) {
                document.body.classList.add("is-focus");
            } else {
                document.body.classList.remove("is-focus");
            }
        };
        document.addEventListener("focus", onFocusChange, true);
    });
}
