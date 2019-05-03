// MIT © 2017 azu
import { UseCase } from "almin";
import {
    GitHubSearchListRepository,
    gitHubSearchListRepository
} from "../../infra/repository/GitHubSearchListRepository";
import { GitHubSearchList, UnionQueryJSON } from "../../domain/GitHubSearchList/GitHubSearchList";
import { createQueryFromUnionQueryJSON } from "../../domain/GitHubSearchList/QueryService";

export const createSaveQueryToSearchListUseCase = () => {
    return new SaveQueryToSearchListUseCase(gitHubSearchListRepository);
};

export class SaveQueryToSearchListUseCase extends UseCase {
    constructor(public gitHubSearchListRepository: GitHubSearchListRepository) {
        super();
    }

    execute(searchList: GitHubSearchList, queryJSON: UnionQueryJSON) {
        const query = createQueryFromUnionQueryJSON(queryJSON);
        const newSearchList = searchList.saveQuery(query);
        return this.gitHubSearchListRepository.save(newSearchList);
    }
}
