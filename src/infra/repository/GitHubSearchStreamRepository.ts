// MIT © 2017 azu
import { BaseRepository } from "./BaseRepository";
import { GitHubSearchStreamFactory } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStreamFactory";
import {
    GitHubSearchStream,
    GitHubSearchStreamJSON
} from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStream";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import localForge from "localforage";

localForge.config({
    name: "Faao"
});

const debug = require("debug")("faao:GitHubSearchStreamRepository");

export class GitHubSearchStreamRepository extends BaseRepository<GitHubSearchStream> {
    findByQuery(query: GitHubSearchQuery): Promise<GitHubSearchStream> {
        const hash = query.hash;
        if (this.map.has(hash)) {
            return Promise.resolve(this.map.get(hash));
        }
        // from storage
        return localForge
            .getItem<GitHubSearchStreamJSON>(hash)
            .then(streamJSON => {
                if (!streamJSON) {
                    debug("Not Found Stream JSON: match query %o", query);
                    return undefined;
                }
                debug("Found Stream JSON: %o match query %o", streamJSON, query);
                return GitHubSearchStreamFactory.createFromStreamJSON(streamJSON);
            })
            .catch(error => {
                debug("Not Found Error", error);
                return Promise.reject(error);
            });
    }

    saveWithQuery(stream: GitHubSearchStream, query: GitHubSearchQuery): Promise<void> {
        const hash = query.hash;
        this.map.set(hash, stream);
        super.save(stream);
        return localForge.setItem(hash, JSON.parse(JSON.stringify(stream))).then(() => {
            debug("Save stream");
        });
    }
}

export const gitHubSearchStreamRepository = new GitHubSearchStreamRepository(GitHubSearchStreamFactory.create());
