// MIT © 2017 azu
import { UseCase } from "almin";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import { createAppUserSelectItemUseCase } from "./AppUserSelectItemUseCase";
import {
    gitHubSearchStreamRepository,
    GitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";

const debug = require("debug")("faao:AppUserOpenPrevItemUseCase");
export const createAppUserSelectPrevItemUseCase = () => {
    return new AppUserSelectPrevItemUseCase({
        appRepository,
        gitHubSearchStreamRepository
    });
};

export class AppUserSelectPrevItemUseCase extends UseCase {
    constructor(
        private args: {
            appRepository: AppRepository;
            gitHubSearchStreamRepository: GitHubSearchStreamRepository;
        }
    ) {
        super();
    }

    async execute() {
        const app = this.args.appRepository.get();
        const currentItem = app.user.activity.openedItem;
        const activeStreamId = app.user.activity.openedStreamId;
        const currentStream = this.args.gitHubSearchStreamRepository.findById(activeStreamId);
        if (!currentItem || !currentStream) {
            debug("Not found current item or stream");
            return;
        }
        const prevItem = currentStream.itemSortedCollection.getPrevItem(currentItem);
        if (!prevItem) {
            debug("Not found prev item");
            return;
        }
        app.user.openItem(prevItem);
        await this.args.appRepository.save(app);
        return this.context.useCase(createAppUserSelectItemUseCase()).executor(useCase => {
            return useCase.execute(prevItem);
        });
    }
}
