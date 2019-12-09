// MIT © 2017 azu
import { UseCase } from "almin";
import { OpenItemInNewTabUseCase } from "./OpenItemInNewTabUseCase";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import {
    GitHubSearchListRepository,
    gitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";
import {
    GitHubSearchStreamRepository,
    gitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { PrefetchItemsForOpen } from "./PrefetchItemsForOpen";
import { GitHubSearchStreamStateItem } from "../../store/GitHubSearchStreamStore/GitHubSearchStreamStateItem";
import { GitHubActiveItem, isGitHubActiveItem } from "../../domain/App/Activity/GitHubActiveItem";
import { Identifier } from "../../domain/Entity";
import { convertFromStateItemToActiveItem } from "../../domain/App/Activity/GitHubActiveItemService";

const debug = require("debug")("AppUserOpenItemUseCase");

export const createAppUserOpenItemUseCase = () => {
    return new AppUserOpenItemUseCase(
        appRepository,
        gitHubSearchStreamRepository,
        gitHubSearchListRepository
    );
};

export class AppUserOpenItemUseCase extends UseCase {
    constructor(
        public appRepository: AppRepository,
        public searchStreamRepository: GitHubSearchStreamRepository,
        public searchListRepository: GitHubSearchListRepository
    ) {
        super();
    }

    async execute(item: GitHubSearchStreamStateItem | GitHubActiveItem) {
        const app = this.appRepository.get();
        const activeItem = isGitHubActiveItem(item) ? item : convertFromStateItemToActiveItem(item);
        app.user.openItem(activeItem);
        await this.appRepository.save(app);
        return this.context
            .useCase(new OpenItemInNewTabUseCase())
            .execute(activeItem.html_url)
            .then(() => {
                const activity = app.user.activity;
                const activeSearchStream = activity.openedStreamId
                    ? this.searchStreamRepository.findById(activity.openedStreamId)
                    : undefined;
                debug("activeSearchStream", activeSearchStream);
                if (!activeSearchStream) {
                    return;
                }
                const nextItems = activeSearchStream.itemSortedCollection.sliceItemsFromCurrentItem(
                    item,
                    3 // prefetch items // TODO: fix harcode
                );
                debug("prefetch items:", nextItems);
                const itemsUrls = nextItems.map(item => item.html_url);
                return this.context.useCase(new PrefetchItemsForOpen()).execute(itemsUrls);
            });
    }
}
