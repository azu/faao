// MIT © 2017 azu
import { createStorageInstance } from "./Storage";
import { GitHubUser, GitHubUserJSON } from "../../domain/GitHubUser/GitHubUser";
import { NullableBaseRepository } from "./NullableBaseRepository";

const debug = require("debug")("faao:GitHubUserRepository");

export class GitHubUserRepository extends NullableBaseRepository<GitHubUser> {
    storage!: LocalForage;

    /**
     * Please call this before find* API
     * @returns {Promise<any>}
     */
    async ready(): Promise<this> {
        if (this.map.size > 0) {
            return Promise.resolve(this);
        }
        this.storage = createStorageInstance({
            name: "GitHubUserRepository"
        });
        await this.storage.ready();
        const values: GitHubUserJSON[] = [];
        await this.storage.iterate(value => {
            values.push(value);
        });
        values
            .map(json => {
                return GitHubUser.fromJSON(json);
            })
            .forEach(user => {
                this.map.set(user.id, user);
            });
        return this;
    }

    save(entity: GitHubUser): Promise<void> {
        super.save(entity);
        return this.storage.setItem(entity.id.toValue(), entity.toJSON()).then(() => {
            debug("Save entity to GitHubUserRepository");
        });
    }

    clear() {
        super.clear();
        return this.storage.clear();
    }
}

export const gitHubUserRepository = new GitHubUserRepository();
