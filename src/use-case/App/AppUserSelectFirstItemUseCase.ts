// MIT © 2017 azu
import { UseCase } from "almin";
import { createAppUserSelectItemUseCase } from "./AppUserSelectItemUseCase";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";

export const createAppUserSelectFirstItemUseCase = () => {
    return new AppUserSelectFirstItemUseCase(appRepository);
};

/**
 * AppUser select first item in the current stream.
 */
export class AppUserSelectFirstItemUseCase extends UseCase {
    constructor(public appRepository: AppRepository) {
        super();
    }

    execute() {
        const app = this.appRepository.get();
        const currentStream = app.user.activity.activeStream;
        if (!currentStream) {
            return;
        }
        const firstItem = currentStream.getFirstItem();
        if (!firstItem) {
            return;
        }
        return this.context.useCase(createAppUserSelectItemUseCase())
            .executor(useCase => useCase.execute(firstItem));
    }
}