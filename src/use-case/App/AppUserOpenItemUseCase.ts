// MIT © 2017 azu
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
    return new AppUserOpenItemUseCase(appRepository, gitHubSearchStreamRepository);
};

export class AppUserOpenItemUseCase extends UseCase {
    constructor(
        public appRepository: AppRepository,
        public searchStreamRepository: GitHubSearchStreamRepository
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
                const gitHubSearchStream = this.searchStreamRepository.get();
                const nextItems = gitHubSearchStream.itemSortedCollection.sliceItemsFromCurrentItem(
                    item,
                    3
                );
                return this.context.useCase(new PrefetchItemsForOpen()).executor(useCase => {
                    const itemsUrls = nextItems.map(item => item.html_url);
                    return useCase.execute(itemsUrls);
                });
            });
    }
}
