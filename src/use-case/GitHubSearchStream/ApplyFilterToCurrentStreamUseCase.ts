// MIT © 2017 azu
import { UseCase } from "almin";
import {
    GitHubSearchStreamRepository,
    gitHubSearchStreamRepository
} from "../../infra/repository/GitHubSearchStreamRepository";
import { AppRepository, appRepository } from "../../infra/repository/AppRepository";
import { SearchFilterFactory } from "../../domain/GitHubSearchStream/SearchFilter/SearchFilterFactory";
import {
    gitHubUserRepository,
    GitHubUserRepository
} from "../../infra/repository/GitHubUserRepository";

const debug = require("debug")("faao:ApplyFilterToCurrentStreamUseCase");

export const createApplyFilterToCurrentStreamUseCase = () => {
    return new ApplyFilterToCurrentStreamUseCase({
        appRepository,
        gitHubSearchStreamRepository,
        gitHubUserRepository
    });
};

export class ApplyFilterToCurrentStreamUseCase extends UseCase {
    constructor(
        private args: {
            appRepository: AppRepository;
            gitHubSearchStreamRepository: GitHubSearchStreamRepository;
            gitHubUserRepository: GitHubUserRepository;
        }
    ) {
        super();
    }

    execute(filterWord: string) {
        const filters = SearchFilterFactory.create(filterWord);
        const app = this.args.appRepository.get();
        const activeStreamId = app.user.activity.openedStreamId;
        const activeStream = this.args.gitHubSearchStreamRepository.findById(activeStreamId);
        if (!activeStream) {
            return debug("Not found current stream, streamId: %o", activeStreamId);
        }
        const newStream = activeStream.applyFilterToStream(filters);
        if (app.user.activity.openedQuery) {
            return this.args.gitHubSearchStreamRepository.saveWithQuery(
                newStream,
                app.user.activity.openedQuery
            );
        } else if (app.user.activity.openedSearchListId) {
            return this.args.gitHubSearchStreamRepository.saveWithSearchList(
                newStream,
                app.user.activity.openedSearchListId
            );
        }
    }
}
