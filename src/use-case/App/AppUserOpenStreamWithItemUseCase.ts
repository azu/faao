// MIT © 2017 azu
import { UseCase } from "almin";
import { UnionQuery } from "../../domain/GitHubSearchList/queries/QueryRole";
import { GitHubSearchResultItem } from "../../domain/GitHubSearchStream/GitHubSearchResultItem";
import { createAppUserOpenStreamUseCase } from "./AppUserOpenStreamUseCase";
import { createAppUserOpenItemUseCase } from "./AppUserOpenItemUseCase";

export const createAppUserOpenStreamWithItemUseCase = () => {
    return new AppUserOpenStreamWithItemUseCase();
};

export class AppUserOpenStreamWithItemUseCase extends UseCase {
    async execute(query: UnionQuery, item: GitHubSearchResultItem) {
        await this.context.useCase(createAppUserOpenStreamUseCase()).execute(query);
        await this.context.useCase(createAppUserOpenItemUseCase()).execute(item);
    }
}
