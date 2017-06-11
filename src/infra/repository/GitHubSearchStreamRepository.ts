// MIT © 2017 azu
import { GitHubSearchStreamFactory } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStreamFactory";
import {
    GitHubSearchStream,
    GitHubSearchStreamJSON
} from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import localForage from "localforage";
import { NonNullableBaseRepository } from "./NonNullableBaseRepository";
import { GitHubSearchList } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchList";

const debug = require("debug")("faao:GitHubSearchStreamRepository");

export class GitHubSearchStreamRepository extends NonNullableBaseRepository<GitHubSearchStream> {
    storage = localForage.createInstance({
        name: "GitHubSearchStreamRepository"
    });

    async ready() {
        if (this.map.size > 0) {
            return Promise.resolve(this);
        }
        const values: [string, GitHubSearchStreamJSON][] = [];
        await this.storage.iterate((value, key) => {
            values.push([key, value]);
        });
        values.forEach(([hash, json]) => {
            const stream = GitHubSearchStream.fromJSON(json);
            this.map.set(hash, stream);
        });
        return this;
    }

    findByQuery(query: GitHubSearchQuery): GitHubSearchStream | undefined {
        const hash = query.hash;
        return this.map.get(hash);
    }

    findBySearchList(searchList: GitHubSearchList): GitHubSearchStream | undefined {
        return this.map.get(searchList.id);
    }

    save(_stream: GitHubSearchStream) {
        throw new Error("Use saveWithQuery");
    }

    saveWithQuery(stream: GitHubSearchStream, query: GitHubSearchQuery): Promise<void> {
        const hash = query.hash;
        this.map.set(hash, stream);
        return this.storage.setItem(hash, stream.toJSON()).then(() => {
            debug("Save stream");
        });
    }

    saveWithSearchList(stream: GitHubSearchStream, searchList: GitHubSearchList): Promise<void> {
        this.map.set(searchList.id, stream);
        return this.storage.setItem(searchList.id, stream.toJSON()).then(() => {
            debug("Save stream");
        });
    }
}

export const gitHubSearchStreamRepository = new GitHubSearchStreamRepository(
    GitHubSearchStreamFactory.create()
);
