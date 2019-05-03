// MIT © 2017 azu
import { UseCase } from "almin";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import { createAppUserSelectItemUseCase } from "./AppUserSelectItemUseCase";
import {
    gitHubSearchStreamRepository,
    GitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import {
    gitHubUserRepository,
    GitHubUserRepository
} from "../../infra/repository/GitHubUserRepository";
import { createAppUserOpenGitHubUserEventUseCase } from "./AppUserOpenGitHubUserEventUseCase";
import { isOpenedGitHubUser } from "../../domain/App/Activity/OpenedGitHubUser";
import { isOpenedGitHubStream } from "../../domain/App/Activity/OpenedGitHubStream";

const debug = require("debug")("faao:AppUserOpenPrevItemUseCase");
export const createAppUserSelectPrevItemUseCase = () => {
    return new AppUserSelectPrevItemUseCase({
        appRepository,
        gitHubSearchStreamRepository,
        gitHubUserRepository
    });
};

export class AppUserSelectPrevItemUseCase extends UseCase {
    constructor(
        private args: {
            appRepository: AppRepository;
            gitHubSearchStreamRepository: GitHubSearchStreamRepository;
            gitHubUserRepository: GitHubUserRepository;
        }
    ) {
        super();
    }

    async execute(): Promise<void> {
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
            const nextItem = currentStream.itemSortedCollection.getPrevItem(currentItem);
            if (!nextItem) {
                debug("Not found prev item");
                return;
            }
            return this.context.useCase(createAppUserSelectItemUseCase()).execute(nextItem);
        } else if (isOpenedGitHubUser(openedContent)) {
            const currentUser = this.args.gitHubUserRepository.findById(openedContent.gitHubUserId);
            const currentEvent = openedContent.event;
            if (!currentUser || !currentEvent) {
                debug("Not found user or user event");
                return;
            }
            const nextEvent = currentUser.activity.getPrevEvent(currentEvent);
            if (!nextEvent) {
                debug("Not found prev event");
                return;
            }
            return this.context
                .useCase(createAppUserOpenGitHubUserEventUseCase())
                .execute(nextEvent);
        }
    }
}
