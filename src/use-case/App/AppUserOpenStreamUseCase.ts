// MIT © 2017 azu
import { UseCase } from "almin";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import { GitHubSearchStream } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchList } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchList";

export const createAppUserOpenStreamUseCase = () => {
    return new AppUserOpenStreamUseCase(appRepository);
};

export class AppUserOpenStreamUseCase extends UseCase {
    constructor(public appRepository: AppRepository) {
        super();
    }

    execute(query: GitHubSearchQuery | GitHubSearchList, stream: GitHubSearchStream) {
        const app = this.appRepository.get();
        app.user.openQuery(query);
        app.user.openStream(stream);
        this.appRepository.save(app);
    }
}
