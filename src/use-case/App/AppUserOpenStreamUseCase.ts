// MIT © 2017 azu
import { UseCase } from "almin";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";
import { GitHubSearchStream } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";

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
    }
}