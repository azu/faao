// MIT © 2017 azu
import { UseCase } from "almin";
import { createAppUserSelectItemUseCase } from "./AppUserSelectItemUseCase";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import {
    gitHubSearchStreamRepository,
    GitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";

export const createAppUserSelectFirstItemUseCase = () => {
    return new AppUserSelectFirstItemUseCase({
        appRepository,
        gitHubSearchStreamRepository
    });
};

/**
 * AppUser select first item in the current stream.
 */
export class AppUserSelectFirstItemUseCase extends UseCase {
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
        const activeStreamId = app.user.activity.openedStreamId;
        const currentStream = this.args.gitHubSearchStreamRepository.findById(activeStreamId);
        if (!currentStream) {
            return;
        }
        const firstItem = currentStream.itemSortedCollection.getFirstItem();
        if (!firstItem) {
            return;
        }
        return this.context.useCase(createAppUserSelectItemUseCase()).execute(firstItem);
    }
}
