// MIT © 2017 azu
import { UseCase } from "almin";
import { OpenItemInNewTabUseCase } from "../GitHubSearchStream/OpenItemInNewTabUseCase";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";

const debug = require("debug")("faao:AppUserOpenPrevItemUseCase");
export const createAppUserOpenPrevItemUseCase = () => {
    return new AppUserOpenPrevItemUseCase(
        appRepository
    );
};

export class AppUserOpenPrevItemUseCase extends UseCase {
    constructor(private appRepository: AppRepository) {
        super();
    }

    execute() {
        const app = this.appRepository.get();
        const currentItem = app.user.activity.activeItem;
        const currentStream = app.user.activity.activeStream;
        if (!currentItem || !currentStream) {
            debug("Not found current item or stream");
            return;
        }
        const prevItem = currentStream.getPrevItem(currentItem);
        if (!prevItem) {
            debug("Not found prev item");
            return;
        }
        app.user.openItem(prevItem);
        this.appRepository.save(app);
        return this.context.useCase(new OpenItemInNewTabUseCase()).executor(useCase => {
            return useCase.execute(prevItem.htmlUrl);
        });
    }
}