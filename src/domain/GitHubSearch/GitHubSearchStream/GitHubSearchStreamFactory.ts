// MIT © 2017 azu
import { GitHubSearchStream } from "./GitHubSearchStream";
import { GitHubClient } from "../../../infra/api/GitHubClient";

export class GitHubSearchStreamFactory {
    static create(){
        // FIXME
        const client = new GitHubClient();
        const result = client.search();
        return new GitHubSearchStream(result.items);
    }
}