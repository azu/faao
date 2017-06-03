// MIT © 2017 azu
import { UseCase } from "almin";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import { GitHubSearchStream } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { AppUserSelectItemUseCase } from "./AppUserSelectItemUseCase";

export const createAppUserOpenStreamUseCase = () => {
    return new AppUserOpenStreamUseCase(
        appRepository
    );
};

export class AppUserOpenStreamUseCase extends UseCase {
    constructor(public appRepository: AppRepository) {
        super();
    }

    execute(stream: GitHubSearchStream) {
        const app = this.appRepository.get();
        app.user.openStream(stream);
        this.appRepository.save(app);
        // select first item
        const firstItem = stream.getFirstItem();
        if (!firstItem) {
            return;
        }
        app.user.openItem(firstItem);
        this.appRepository.save(app);
        return this.context.useCase(new AppUserSelectItemUseCase())
            .executor(useCase => useCase.execute(firstItem.htmlUrl));
    }
}