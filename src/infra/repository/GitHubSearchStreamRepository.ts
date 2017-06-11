// MIT © 2017 azu
import { GitHubSearchStreamFactory } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStreamFactory";
import {
    GitHubSearchStream,
    GitHubSearchStreamJSON
} from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import localForage from "localforage";
import { NonNullableBaseRepository } from "./NonNullableBaseRepository";

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

    save(_stream: GitHubSearchStream) {
        throw new Error("Use saveWithQuery");
    }

    saveWithQuery(stream: GitHubSearchStream, query: GitHubSearchQuery): Promise<void> {
        const hash = query.hash;
        this.map.set(hash, stream);
        super.save(stream);
        return this.storage.setItem(hash, stream.toJSON()).then(() => {
            debug("Save stream");
        });
    }
}

export const gitHubSearchStreamRepository = new GitHubSearchStreamRepository(
    GitHubSearchStreamFactory.create()
);
