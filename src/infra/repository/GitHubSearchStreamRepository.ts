// MIT © 2017 azu
import { GitHubSearchStreamFactory } from "../../domain/GitHubSearchStream/GitHubSearchStreamFactory";
import {
    GitHubSearchStream,
    GitHubSearchStreamJSON
} from "../../domain/GitHubSearchStream/GitHubSearchStream";
import { NonNullableBaseRepository } from "./NonNullableBaseRepository";
import { GitHubSearchList } from "../../domain/GitHubSearchList/GitHubSearchList";
import { createStorageInstance } from "./Storage";
import { Identifier } from "../../domain/Entity";
import { EntityMap } from "./EntityMap";
import { QueryRole } from "../../domain/GitHubSearchList/queries/QueryRole";

const debug = require("debug")("faao:GitHubSearchStreamRepository");

export class GitHubSearchStreamRepository extends NonNullableBaseRepository<GitHubSearchStream> {
    storage!: LocalForage;
    map = new EntityMap<GitHubSearchStream>();

    async ready() {
        if (this.map.size > 0) {
            return Promise.resolve(this);
        }
        this.storage = createStorageInstance({
            name: "GitHubSearchStreamRepository"
        });
        await this.storage.ready();
        const values: [string, GitHubSearchStreamJSON][] = [];
        await this.storage.iterate<GitHubSearchStreamJSON, void>((value, key) => {
            values.push([key, value]);
        });
        values.forEach(([hash, json]) => {
            const stream = GitHubSearchStream.fromJSON(json);
            this.map.set(hash, stream);
        });
        return this;
    }

    findById(
        gitHubSearchStreamId?: Identifier<GitHubSearchStream>
    ): GitHubSearchStream | undefined {
        if (!gitHubSearchStreamId) {
            return;
        }
        return this.map.values().find(entity => gitHubSearchStreamId.equals(entity.id));
    }

    findByQuery(query: QueryRole): GitHubSearchStream | undefined {
        const hash = query.hash;
        return this.map.get(hash);
    }

    findBySearchList(searchList: GitHubSearchList): GitHubSearchStream | undefined {
        return this.map.get(searchList.id.toValue());
    }

    save(_stream: GitHubSearchStream) {
        throw new Error("Use saveWithQuery");
    }

    saveWithQuery(stream: GitHubSearchStream, query: QueryRole): Promise<void> {
        const hash = query.hash;
        this.map.set(hash, stream);
        return this.storage.setItem(hash, stream.toJSON()).then(() => {
            debug("Save stream with query");
        });
    }

    saveWithSearchList(
        stream: GitHubSearchStream,
        searchListId: Identifier<GitHubSearchList>
    ): Promise<void> {
        this.map.set(searchListId.toValue(), stream);
        return this.storage.setItem(searchListId.toValue(), stream.toJSON()).then(() => {
            debug("Save stream with SearchList");
        });
    }

    clear() {
        super.clear();
        return this.storage.clear();
    }
}

export const gitHubSearchStreamRepository = new GitHubSearchStreamRepository(
    GitHubSearchStreamFactory.create()
);
