// MIT © 2017 azu
import { UseCase } from "almin";
import throttle from "lodash.throttle";
import { openURLInTab } from "./OpenItemInNewTabUseCase";

const debug = require("debug")("faao:AppUserSelectItemUseCase");
// prevent GPU crash on webview
export const throttledOpenURLInTab = throttle(openURLInTab, 100);

export class AppUserSelectItemUseCase extends UseCase {
    execute(url: string) {
        if (window.electronNavigation) {
            throttledOpenURLInTab(url);
        }else{
            debug("Not support open url in tab.");
        }
    }
}