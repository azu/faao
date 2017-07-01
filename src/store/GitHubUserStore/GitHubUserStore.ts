// MIT © 2017 azu
import { Store } from "almin";
import { GitHubUserRepository } from "../../infra/repository/GitHubUserRepository";
import { AppRepository } from "../../infra/repository/AppRepository";
import { GitHubUserActivityEvent } from "../../domain/GitHubUser/GitHubUserActivityEvent";
import { GitHubUser } from "../../domain/GitHubUser/GitHubUser";
import { ActivityHistory } from "../../domain/App/ActivityHistory";

export class GitHubUserActivityEventVideoModel extends GitHubUserActivityEvent {
    isRead: boolean;

    constructor(event: GitHubUserActivityEvent, isRead: boolean) {
        super(event);
        this.isRead = isRead;
    }
}

export const createInitialGitHubUserState = () => {
    return new GitHubUserState({
        events: [],
        rawEventCount: 0
    });
};

export interface GitHubUserStateArgs {
    filterWord?: string;
    events: GitHubUserActivityEvent[];
    rawEventCount: number;
    activeEvent?: GitHubUserActivityEvent;
}

export class GitHubUserState implements GitHubUserStateArgs {
    filterWord?: string;
    events: GitHubUserActivityEvent[];
    rawEventCount: number;
    activeEvent?: GitHubUserActivityEvent;

    constructor(args: GitHubUserStateArgs) {
        this.filterWord = args.filterWord;
        this.events = args.events;
        this.rawEventCount = args.rawEventCount;
        this.activeEvent = args.activeEvent;
    }

    get shouldShow() {
        return this.rawEventCount > 0;
    }

    update({
        user,
        openedUserEvent,
        userEventHistory
    }: {
        user?: GitHubUser;
        openedUserEvent?: GitHubUserActivityEvent;
        userEventHistory: ActivityHistory<GitHubUserActivityEvent>;
    }): GitHubUserState {
        if (!user || !userEventHistory) {
            return createInitialGitHubUserState();
        }
        return new GitHubUserState({
            filterWord: user.activity.filter ? user.activity.filter.filterText : undefined,
            rawEventCount: user.activity.rawEventCount,
            activeEvent: openedUserEvent,
            events: user.activity.events.map(
                event =>
                    new GitHubUserActivityEventVideoModel(
                        event,
                        userEventHistory.isRead(event.id, event.createAtDate)
                    )
            )
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
        const openedUserId = app.user.activity.openedUserId;
        const openedUserEvent = app.user.activity.openedUserEvent;
        const user = this.args.gitHubUserRepository.findById(openedUserId);
        this.setState(
            this.state.update({
                user,
                openedUserEvent,
                userEventHistory: app.user.activity.userEventHistory
            })
        );
    }

    getState() {
        return this.state;
    }
}
