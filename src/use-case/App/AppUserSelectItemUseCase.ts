// MIT © 2017 azu
import { UseCase } from "almin";
import throttle from "lodash.throttle";
import { openURLInTab } from "./OpenItemInNewTabUseCase";
import { GitHubSearchResultItem } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";

const debug = require("debug")("faao:AppUserSelectItemUseCase");
// prevent GPU crash on webview
export const throttledOpenURLInTab = throttle(openURLInTab, 100);

export const createAppUserSelectItemUseCase = () => {
    return new AppUserSelectItemUseCase(appRepository);
};

export class AppUserSelectItemUseCase extends UseCase {
    constructor(public appRepository: AppRepository) {
        super();
    }

    execute(item: GitHubSearchResultItem) {
        const app = this.appRepository.get();
        app.user.openItem(item);
        this.appRepository.save(app);
        if (window.electronNavigation) {
            throttledOpenURLInTab(item.htmlUrl);
        } else {
            debug("Not support open url in tab.");
        }
    }
}
