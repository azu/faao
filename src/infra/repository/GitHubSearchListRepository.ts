// MIT © 2017 azu
import { GitHubSearchList } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchList";
import { GitHubSearchListFactory } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchListFactory";
import { NonNullableBaseRepository } from "./NonNullableBaseRepository";

export class GitHubSearchListRepository extends NonNullableBaseRepository<GitHubSearchList> {}

export const gitHubSearchListRepository = new GitHubSearchListRepository(GitHubSearchListFactory.create());
