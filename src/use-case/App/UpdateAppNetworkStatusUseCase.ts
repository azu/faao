// MIT © 2017 azu
import { UseCase } from "almin";
import { AppNetworkStatus } from "../../domain/App/AppNetwork";
import { appRepository, AppRepository } from "../../infra/repository/AppRepository";

export const createUpdateAppNetworkStatusUseCase = () => {
    return new UpdateAppNetworkStatusUseCase(appRepository);
};

export class UpdateAppNetworkStatusUseCase extends UseCase {
    constructor(public appRepository: AppRepository) {
        super();
    }

    execute(networkStatus: AppNetworkStatus) {
        const app = this.appRepository.get();
        app.updateNetworkStatus(networkStatus);
        this.appRepository.save(app);
    }
}
