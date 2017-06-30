// MIT © 2017 azu
import { UseCase } from "almin";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import { createAppUserSelectItemUseCase } from "./AppUserSelectItemUseCase";
import {
    gitHubSearchStreamRepository,
    GitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";

const debug = require("debug")("faao:AppUserOpenNextItemUseCase");
export const createAppUserSelectNextItemUseCase = () => {
    return new AppUserSelectNextItemUseCase({
        appRepository,
        gitHubSearchStreamRepository
    });
};

export class AppUserSelectNextItemUseCase extends UseCase {
    constructor(
        private args: {
            appRepository: AppRepository;
            gitHubSearchStreamRepository: GitHubSearchStreamRepository;
        }
    ) {
        super();
    }

    execute() {
        const app = this.args.appRepository.get();
        const currentItem = app.user.activity.openedItem;
        const currentStreamId = app.user.activity.openedStreamId;
        const currentStream = this.args.gitHubSearchStreamRepository.findById(currentStreamId);
        if (!currentItem || !currentStream) {
            debug("Not found current item or stream");
            return;
        }
        const nextItem = currentStream.itemSortedCollection.getNextItem(currentItem);
        if (!nextItem) {
            debug("Not found next item");
            return;
        }
        return this.context.useCase(createAppUserSelectItemUseCase()).executor(useCase => {
            return useCase.execute(nextItem);
        });
    }
}
