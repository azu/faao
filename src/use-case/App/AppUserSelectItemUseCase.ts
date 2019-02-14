// MIT © 2017 azu
import { UseCase } from "almin";
import { GitHubSearchResultItem } from "../../domain/GitHubSearchStream/GitHubSearchResultItem";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import isElectron from "is-electron";
import { createAppUserOpenItemUseCase } from "./AppUserOpenItemUseCase";

const debug = require("debug")("faao:AppUserSelectItemUseCase");

export const createAppUserSelectItemUseCase = () => {
    return new AppUserSelectItemUseCase(appRepository);
};

export class AppUserSelectItemUseCase extends UseCase {
    constructor(public appRepository: AppRepository) {
        super();
    }

    async execute(item: GitHubSearchResultItem) {
        const app = this.appRepository.get();
        app.user.openItem(item);
        await this.appRepository.save(app);
        if (isElectron()) {
            return this.context.useCase(createAppUserOpenItemUseCase()).execute(item);
        } else {
            debug("Not support open url in tab.");
        }
    }
}
