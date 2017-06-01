import { BaseRepository } from "./BaseRepository";
import { GitHubSettings } from "../../domain/GitHubSetting/GitHubSettings";
import { GitHubSettingsFactory } from "../../domain/GitHubSetting/GitHubSettingsFactory";

export class GitHubSettingsRepository extends BaseRepository<GitHubSettings> {

}
export const gitHubSettingsRepository = new GitHubSettingsRepository(GitHubSettingsFactory.create());