// MIT © 2017 azu
import isElectron from "is-electron";

export const initializeElectron = () => {
    if (!isElectron()) {
        return;
    }
    inject();
};

export function inject() {
    document.body.classList.add("electron-view");
}
