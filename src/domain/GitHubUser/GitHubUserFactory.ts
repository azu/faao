// MIT © 2017 azu
import { GitHubUser } from "./GitHubUser";
import { Identifier } from "../Entity";
import { ulid } from "ulid";
import { DefaultEventMaxLimit, GitHubUserActivity } from "./GitHubUserActivity";

export class GitHubUserFactory {
    static create() {
        return new GitHubUser({
            id: new Identifier<GitHubUser>(ulid()),
            activity: new GitHubUserActivity({
                events: [],
                eventMaxLimit: DefaultEventMaxLimit
            })
        });
    }
}
