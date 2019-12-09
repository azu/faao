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
import {
    convertFromSortedItemToActiveItem,
    convertFromStateItemToActiveItem
} from "../../domain/App/Activity/GitHubActiveItemService";
import {
    isSortedCollectionItem,
    SortedCollectionItem
} from "../../domain/GitHubSearchStream/SortedCollection";
import {
    ForecastDirection,
    forecastUserMoving
} from "../../domain/App/Activity/ForecastUserMoving";

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

    async execute(item: GitHubSearchStreamStateItem | GitHubActiveItem | SortedCollectionItem) {
        const app = this.appRepository.get();
        const activeItem = isGitHubActiveItem(item)
            ? item
            : isSortedCollectionItem(item)
            ? convertFromSortedItemToActiveItem(item)
            : convertFromStateItemToActiveItem(item);
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
                const Direction = forecastUserMoving({
                    appUser: app.user,
                    activeSearchStream,
                    nextItem: item
                });
                const nextItems = activeSearchStream.itemSortedCollection.sliceItemsFromCurrentItem(
                    item,
                    // prefetch items // TODO: fix harcode
                    // - is ↑ prefetch
                    // + is ↓ prefetch
                    Direction === ForecastDirection.UP ? -3 : 3
                );
                debug("prefetch items:", nextItems);
                const itemsUrls = nextItems.map(item => item.html_url);
                return this.context.useCase(new PrefetchItemsForOpen()).execute(itemsUrls);
            });
    }
}
