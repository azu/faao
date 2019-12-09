// MIT © 2017 azu
import { UseCase } from "almin";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import isElectron from "is-electron";
import { createAppUserOpenItemUseCase } from "./AppUserOpenItemUseCase";
import { SortedCollectionItem } from "../../domain/GitHubSearchStream/SortedCollection";
import { GitHubActiveItem, isGitHubActiveItem } from "../../domain/App/Activity/GitHubActiveItem";
import { convertFromSortedItemToActiveItem } from "../../domain/App/Activity/GitHubActiveItemService";

const debug = require("debug")("faao:AppUserSelectItemUseCase");

export const createAppUserSelectItemUseCase = () => {
    return new AppUserSelectItemUseCase(appRepository);
};

export class AppUserSelectItemUseCase extends UseCase {
    constructor(public appRepository: AppRepository) {
        super();
    }

    async execute(item: SortedCollectionItem | GitHubActiveItem) {
        const app = this.appRepository.get();
        const activeItem = isGitHubActiveItem(item)
            ? item
            : convertFromSortedItemToActiveItem(item);
        app.user.openItem(activeItem);
        await this.appRepository.save(app);
        if (isElectron()) {
            return this.context.useCase(createAppUserOpenItemUseCase()).execute(activeItem);
        } else {
            debug("Not support open url in tab.");
        }
    }
}
