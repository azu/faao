// MIT © 2017 azu
import isElectron from "is-electron";

export const initializeBrowser = () => {
    if (isElectron()) {
        return;
    }
    inject();
};

export function inject() {
    // body class="browser-view"
    document.body.classList.add("browser-view");
}
