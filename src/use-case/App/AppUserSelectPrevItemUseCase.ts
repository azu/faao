// MIT © 2017 azu
import { UseCase } from "almin";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import { createAppUserSelectItemUseCase } from "./AppUserSelectItemUseCase";

const debug = require("debug")("faao:AppUserOpenPrevItemUseCase");
export const createAppUserSelectPrevItemUseCase = () => {
    return new AppUserSelectPrevItemUseCase(
        appRepository
    );
};

export class AppUserSelectPrevItemUseCase extends UseCase {
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
        return this.context.useCase(createAppUserSelectItemUseCase()).executor(useCase => {
            return useCase.execute(prevItem);
        });
    }
}