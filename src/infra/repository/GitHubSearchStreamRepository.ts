// MIT © 2017 azu
import { BaseRepository } from "./BaseRepository";
import { GitHubSearchStreamFactory } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStreamFactory";
import { GitHubSearchStream } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";

export class GitHubSearchStreamRepository extends BaseRepository<GitHubSearchStream> {

}

export default new GitHubSearchStreamRepository(GitHubSearchStreamFactory.create());