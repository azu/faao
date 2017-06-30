// MIT © 2017 azu
import { Store } from "almin";
import { GitHubUserRepository } from "../../infra/repository/GitHubUserRepository";
import { AppRepository } from "../../infra/repository/AppRepository";
import { GitHubUserActivityEvent } from "../../domain/GitHubUser/GitHubUserActivityEvent";
import { GitHubUser } from "../../domain/GitHubUser/GitHubUser";

const parseGitHubEvent = require("parse-github-event");

export class GitHubUserActivityEventVideoModel extends GitHubUserActivityEvent {
    get description() {
        return parseGitHubEvent.compile(this.toJSON());
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
        const user = this.args.gitHubUserRepository.findById(app.user.activity.openedUserId);
        this.setState(this.state.update(user));
    }

    getState() {
        return this.state;
    }
}
