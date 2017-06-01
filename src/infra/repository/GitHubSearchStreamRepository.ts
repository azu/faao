// MIT © 2017 azu
import { BaseRepository } from "./BaseRepository";
import { GitHubSearchStreamFactory } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStreamFactory";
import { GitHubSearchStream } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";

export class GitHubSearchStreamRepository extends BaseRepository<GitHubSearchStream> {

    findByQuery(query: GitHubSearchQuery): GitHubSearchStream | undefined {
        return this.map.get(query.hash);
    }

    saveWithQuery(stream: GitHubSearchStream, query: GitHubSearchQuery): void {
        this.map.set(query.hash, stream);
        super.save(stream);
    }
}

export const gitHubSearchStreamRepository = new GitHubSearchStreamRepository(GitHubSearchStreamFactory.create());