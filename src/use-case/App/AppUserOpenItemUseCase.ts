// MIT © 2017 azu
import { UseCase } from "almin";
import { OpenItemInNewTabUseCase } from "./OpenItemInNewTabUseCase";
import { GitHubSearchResultItem } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";

export const createAppUserOpenItemUseCase = () => {
    return new AppUserOpenItemUseCase(appRepository);
};

export class AppUserOpenItemUseCase extends UseCase {
    constructor(public appRepository: AppRepository) {
        super();
    }

    async execute(item: GitHubSearchResultItem) {
        const app = this.appRepository.get();
        app.user.openItem(item);
        await this.appRepository.save(app);
        return this.context.useCase(new OpenItemInNewTabUseCase()).executor(useCase => {
            return useCase.execute(item.htmlUrl);
        });
    }
}
