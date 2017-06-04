// MIT © 2017 azu
import { BaseRepository } from "./BaseRepository";
import { GitHubSearchList } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchList";
import { GitHubSearchListFactory } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchListFactory";

export class GitHubSearchListRepository extends BaseRepository<GitHubSearchList> {

}

export const gitHubSearchListRepository =  new GitHubSearchListRepository(GitHubSearchListFactory.create());