// MIT © 2017 azu
import { UseCase } from "almin";
import { OpenItemInNewTabUseCase } from "../GitHubSearchStream/OpenItemInNewTabUseCase";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";

const debug = require("debug")("faao:AppUserOpenNextItemUseCase");
export const createAppUserOpenNextItemUseCase = () => {
    return new AppUserOpenNextItemUseCase(
        appRepository
    );
};

export class AppUserOpenNextItemUseCase extends UseCase {
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
        const nextItem = currentStream.getNextItem(currentItem);
        if (!nextItem) {
            debug("Not found next item");
            return;
        }
        app.user.openItem(nextItem);
        this.appRepository.save(app);
        return this.context.useCase(new OpenItemInNewTabUseCase()).executor(useCase => {
            return useCase.execute(nextItem.htmlUrl);
        });
    }
}