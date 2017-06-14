// MIT © 2017 azu
import { GitHubSearchList } from "./GitHubSearchList";

export class GitHubSearchListFactory {
    static createDefaultSearchList() {
        return this.create("Queries");
    }

    static create(name: string) {
        return new GitHubSearchList({
            name: name,
            queries: []
        });
    }
}
