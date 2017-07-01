// MIT © 2017 azu
import { GitHubSearchList } from "./GitHubSearchList";
import { Identifier } from "../Entity";
import ulid from "ulid";

export class GitHubSearchListFactory {
    static createDefaultSearchList() {
        return this.create("Queries");
    }

    static create(name: string) {
        return new GitHubSearchList({
            id: new Identifier<GitHubSearchList>(ulid()),
            name: name,
            queries: []
        });
    }
}
