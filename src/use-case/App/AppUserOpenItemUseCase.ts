// MIT © 2017 azu
const debug = require("debug")("AppUserOpenItemUseCase");
import { UseCase } from "almin";
import { OpenItemInNewTabUseCase } from "./OpenItemInNewTabUseCase";
import { GitHubSearchResultItem } from "../../domain/GitHubSearchStream/GitHubSearchResultItem";
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

    async execute(item: GitHubSearchResultItem) {
        const app = this.appRepository.get();
        app.user.openItem(item);
        await this.appRepository.save(app);
        return this.context
            .useCase(new OpenItemInNewTabUseCase())
            .executor(useCase => {
                return useCase.execute(item.html_url);
            })
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
                    8 // prefetch items // TODO: fix harcode
                );
                debug("prefetch items:", nextItems);
                return this.context.useCase(new PrefetchItemsForOpen()).executor(useCase => {
                    const itemsUrls = nextItems.map(item => item.html_url);
                    return useCase.execute(itemsUrls);
                });
            });
    }
}
