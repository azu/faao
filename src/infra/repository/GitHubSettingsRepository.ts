import { BaseRepository } from "./BaseRepository";
import { GitHubSettingFactory } from "../../domain/GitHubSetting/GitHubSettingsFactory";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";
import { EntityId } from "../../domain/util/EntityId";

export class GitHubSettingRepository extends BaseRepository<GitHubSetting> {
    findAll() {
        return this.map.values();
    }

    findGitHubSettingById(id: EntityId<GitHubSetting>): GitHubSetting | undefined {
        return this.findById(id);
    }
}

export const gitHubSettingRepository = new GitHubSettingRepository(GitHubSettingFactory.create());