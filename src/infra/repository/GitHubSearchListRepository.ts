// MIT © 2017 azu
import {
    GitHubSearchList,
    GitHubSearchListJSON
} from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchList";
import { GitHubSearchListFactory } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchListFactory";
import { NonNullableBaseRepository } from "./NonNullableBaseRepository";
import localForge from "localforage";

const debug = require("debug")("faao:GitHubSearchListRepository");

export class GitHubSearchListRepository extends NonNullableBaseRepository<GitHubSearchList> {
    storage = localForge.createInstance({
        name: "GitHubSearchListRepository"
    });

    /**
     * Please call this before find* API
     * @returns {Promise<any>}
     */
    async ready(): Promise<this> {
        if (this.map.size > 0) {
            return Promise.resolve(this);
        }
        const values: GitHubSearchListJSON[] = [];
        await this.storage.iterate(value => {
            values.push(value);
        });
        values
            .map(json => {
                return GitHubSearchList.fromJSON(json);
            })
            .forEach(searchList => {
                this.map.set(searchList.id, searchList);
                this.lastUsed = searchList;
            });
        return this;
    }

    save(entity: GitHubSearchList): Promise<void> {
        super.save(entity);
        return this.storage.setItem(entity.id, entity.toJSON()).then(() => {
            debug("Save entity");
        });
    }
}

export const gitHubSearchListRepository = new GitHubSearchListRepository(
    GitHubSearchListFactory.create()
);
