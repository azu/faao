// MIT © 2017 azu
import { Store } from "almin";
import { GitHubUserRepository } from "../../infra/repository/GitHubUserRepository";
import { AppRepository } from "../../infra/repository/AppRepository";
import { GitHubUserActivityEvent } from "../../domain/GitHubUser/GitHubUserActivityEvent";
import { GitHubUser } from "../../domain/GitHubUser/GitHubUser";

import { compile, parse, ParsedEvent } from "parse-github-event";
import { isOpenedGitHubUser } from "../../domain/App/Activity/OpenedGitHubUser";

export class GitHubUserActivityEventVideoModel extends GitHubUserActivityEvent {
    parsedEvent?: ParsedEvent;

    constructor(event: GitHubUserActivityEvent) {
        super(event);
        this.parsedEvent = parse(this.toJSON());
    }

    get htmlURL() {
        if (!this.parsedEvent) {
            return "";
        }
        return this.parsedEvent.html_url;
    }

    get description() {
        if (!this.parsedEvent) {
            return "NO DATA";
        }
        return compile(this.parsedEvent);
    }
}

export const createInitialGitHubUserState = () => {
    return new GitHubUserState({
        events: []
    });
};

export interface GitHubUserStateArgs {
    events: GitHubUserActivityEvent[];
}

export class GitHubUserState implements GitHubUserStateArgs {
    events: GitHubUserActivityEvent[];

    constructor(args: GitHubUserStateArgs) {
        this.events = args.events;
    }

    get shouldShow() {
        return this.events.length > 0;
    }

    update(user?: GitHubUser): GitHubUserState {
        if (!user) {
            return createInitialGitHubUserState();
        }
        return new GitHubUserState({
            events: user.activity.events.map(event => new GitHubUserActivityEventVideoModel(event))
        });
    }
}

export interface GitHubUserStoreArgs {
    appRepository: AppRepository;
    gitHubUserRepository: GitHubUserRepository;
}

export class GitHubUserStore extends Store<GitHubUserState> {
    state: GitHubUserState;

    constructor(private args: GitHubUserStoreArgs) {
        super();
        this.state = createInitialGitHubUserState();
    }

    receivePayload() {
        const app = this.args.appRepository.get();
        const openedUserId = isOpenedGitHubUser(app.user.activity.openedContent)
            ? app.user.activity.openedContent.gitHubUserId
            : undefined;
        const user = this.args.gitHubUserRepository.findById(openedUserId);
        this.setState(this.state.update(user));
    }

    getState() {
        return this.state;
    }
}
