// MIT © 2017 azu
import isElectron from "is-electron";
import { initializeBrowser } from "./browser";
import { initializeElectron } from "./electron";

export function runDOMBootstrap() {
    if (isElectron()) {
        initializeElectron();
    } else {
        initializeBrowser();
    }
}
