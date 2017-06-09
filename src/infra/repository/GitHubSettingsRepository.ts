import { BaseRepository } from "./BaseRepository";
import { GitHubSettingFactory } from "../../domain/GitHubSetting/GitHubSettingsFactory";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";
import { EntityId } from "../../domain/util/EntityId";
import localForge from "localforage";

export class GitHubSettingRepository extends BaseRepository<GitHubSetting> {
    findAll(): Promise<GitHubSetting[]> {
        return Promise.resolve(this.map.values());
    }

    findGitHubSettingById(id: EntityId<GitHubSetting>): Promise<GitHubSetting | undefined> {
        return Promise.resolve(this.findById(id));
    }

    save(entity: GitHubSetting): Promise<void> {
        super.save(entity);
        return Promise.resolve();
    }

    replace(prevSetting: GitHubSetting, newSetting: GitHubSetting): Promise<void> {
        newSetting.id = prevSetting.id;
        return this.save(newSetting);
    }
}

export const gitHubSettingRepository = new GitHubSettingRepository(GitHubSettingFactory.create());
