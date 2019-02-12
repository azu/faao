// MIT © 2017 azu
import { GitHubUserActivityEvent, GitHubUserActivityEventJSON } from "./GitHubUserActivityEvent";
import { Identifier } from "../Entity";

export class GitHubUserActivityEventFactory {
    static create(item: GitHubUserActivityEventJSON) {
        // FIXME: should fix type
        // @ts-ignore
        return new GitHubUserActivityEvent({
            ...item,
            id: new Identifier<GitHubUserActivityEvent>(item.id)
        });
    }
}
