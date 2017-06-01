// MIT © 2017 azu
import { BaseRepository } from "./BaseRepository";
import { GitHubSearchList } from "../../domain/GitHubSearch/GitHubSearchList";
import { GitHubSearchListFactory } from "../../domain/GitHubSearch/GitHubSearchListFactory";

export class GitHubSearchListRepository extends BaseRepository<GitHubSearchList> {

}

export default new GitHubSearchListRepository(GitHubSearchListFactory.create());