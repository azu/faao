// MIT © 2017 azu
import { GitHubSearchStream } from "./GitHubSearchStream";

export class GitHubSearchStreamFactory {
    static create(){
        return new GitHubSearchStream([]);
    }
}