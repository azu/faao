// MIT © 2017 azu
import { UseCase } from "almin";
import throttle from "lodash.throttle";
import { openPage } from "./OpenItemInNewTabUseCase";

// prevent GPU crash on webview
export const throttledOpenPage = throttle(openPage, 100);

export class AppUserSelectItemUseCase extends UseCase {
    execute(url: string) {
        openPage(url);
    }
}