// MIT © 2017 azu
import { UseCase } from "almin";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import { createAppUserSelectItemUseCase } from "./AppUserSelectItemUseCase";

const debug = require("debug")("faao:AppUserOpenNextItemUseCase");
export const createAppUserSelectNextItemUseCase = () => {
    return new AppUserSelectNextItemUseCase(appRepository);
};

export class AppUserSelectNextItemUseCase extends UseCase {
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
