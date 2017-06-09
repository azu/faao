import { BaseRepository } from "./BaseRepository";
import { GitHubSettingFactory } from "../../domain/GitHubSetting/GitHubSettingsFactory";
import { GitHubSetting, GitHubSettingJSON } from "../../domain/GitHubSetting/GitHubSetting";
import { EntityId } from "../../domain/util/EntityId";
import localForge from "localforage";

const debug = require("debug")("faao:GitHubSettingRepository");
const storage = localForge.createInstance({
    name: "GitHubSettingRepository"
});

export class GitHubSettingRepository extends BaseRepository<GitHubSetting> {
    constructor(initialEntity: GitHubSetting) {
        super(initialEntity);
    }

    /**
     * Please call this before find* API
     * @returns {Promise<any>}
     */
    async ready(): Promise<this> {
        if (this.map.size > 0) {
            return Promise.resolve(this);
        }
        const values: GitHubSettingJSON[] = [];
        await storage.iterate(value => {
            values.push(value);
        });
        values
            .map(json => {
                return GitHubSetting.fromJSON(json);
            })
            .forEach(gitHubSetting => {
                this.map.set(gitHubSetting.id.toValue(), gitHubSetting);
            });
        return this;
    }

    findAll(): GitHubSetting[] {
        return this.map.values();
    }

    findGitHubSettingById(id: EntityId<GitHubSetting>): GitHubSetting | undefined {
        return this.findById(id);
    }

    save(entity: GitHubSetting): Promise<void> {
        super.save(entity);
        return storage.setItem(entity.id.toValue(), entity.toJSON()).then(() => {
            debug("Save entity");
        });
    }

    replace(prevSetting: GitHubSetting, newSetting: GitHubSetting): Promise<void> {
        newSetting.id = prevSetting.id;
        return this.save(newSetting);
    }
}

export const gitHubSettingRepository = new GitHubSettingRepository(GitHubSettingFactory.create());
