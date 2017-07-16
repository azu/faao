// MIT © 2017 azu
import { UseCase } from "almin";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import { createAppUserSelectItemUseCase } from "./AppUserSelectItemUseCase";
import {
    gitHubSearchStreamRepository,
    GitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { isOpenedGitHubStream } from "../../domain/App/Activity/OpenedGitHubStream";
import { isOpenedGitHubUser } from "../../domain/App/Activity/OpenedGitHubUser";
import {
    gitHubUserRepository,
    GitHubUserRepository
} from "../../infra/repository/GitHubUserRepository";
import { createAppUserOpenGitHubUserEventUseCase } from "./AppUserOpenGitHubUserEventUseCase";

const debug = require("debug")("faao:AppUserOpenNextItemUseCase");
export const createAppUserSelectNextItemUseCase = () => {
    return new AppUserSelectNextItemUseCase({
        appRepository,
        gitHubSearchStreamRepository,
        gitHubUserRepository
    });
};

// next item
export class AppUserSelectNextItemUseCase extends UseCase {
    constructor(
        private args: {
            appRepository: AppRepository;
            gitHubSearchStreamRepository: GitHubSearchStreamRepository;
            gitHubUserRepository: GitHubUserRepository;
        }
    ) {
        super();
    }

    execute() {
        const app = this.args.appRepository.get();
        const openedContent = app.user.activity.openedContent;
        if (isOpenedGitHubStream(openedContent)) {
            const currentStream = this.args.gitHubSearchStreamRepository.findById(
                openedContent.gitHubSearchStreamId
            );
            const currentItem = openedContent.item;
            if (!currentStream || !currentItem) {
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
        } else if (isOpenedGitHubUser(openedContent)) {
            const currentUser = this.args.gitHubUserRepository.findById(openedContent.gitHubUserId);
            const currentEvent = openedContent.event;
            if (!currentUser || !currentEvent) {
                debug("Not found user or user event");
                return;
            }
            const nextEvent = currentUser.activity.getNextEvent(currentEvent);
            if (!nextEvent) {
                debug("Not found next event");
                return;
            }
            return this.context
                .useCase(createAppUserOpenGitHubUserEventUseCase())
                .executor(useCase => {
                    return useCase.execute(nextEvent);
                });
        } else {
            throw new Error("Unknown openedContent:" + openedContent);
        }
    }
}
