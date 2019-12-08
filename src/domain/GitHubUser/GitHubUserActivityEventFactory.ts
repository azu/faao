// MIT © 2017 azu
import { GitHubUserActivityEvent, GitHubUserActivityEventJSON } from "./GitHubUserActivityEvent";
import { Identifier } from "../Entity";
import { parse } from "parse-github-event";

export class GitHubUserActivityEventFactory {
    static create(item: GitHubUserActivityEventJSON) {
        return new GitHubUserActivityEvent({
            ...item,
            id: new Identifier<GitHubUserActivityEvent>(item.id),
            parsedEvent: parse(item as any)
        });
    }
}
