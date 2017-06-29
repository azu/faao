// MIT © 2017 azu
import { GitHubUserActivityEvent, GitHubUserActivityEventJSON } from "./GitHubUserActivityEvent";
import { ValueObject } from "../ValueObject";

const debug = require("debug")("faao:GitHubUserActivity");

export interface GitHubUserActivityJSON {
    events: GitHubUserActivityEventJSON[];
    eventMaxLimit: number;
}

export interface GitHubUserActivityArgs {
    events: GitHubUserActivityEvent[];
    eventMaxLimit: number;
}

export const DefaultEventMaxLimit = 500;
export class GitHubUserActivity extends ValueObject {
    events: GitHubUserActivityEvent[];
    eventMaxLimit: number;

    constructor(args: GitHubUserActivityArgs) {
        super();
        this.events = args.events;
        this.eventMaxLimit = args.eventMaxLimit;
    }

    addEvent(aEvent: GitHubUserActivityEvent) {
        const hasSameEvent = this.events.some(event => aEvent.equals(event));
        if (hasSameEvent) {
            return debug("Already has same event: %o", aEvent);
        }
        this.events = this.events.concat(aEvent);
    }

    /**
     * add multiple events
     */
    mergeEvents(events: GitHubUserActivityEvent[]) {
        events.forEach(event => this.addEvent(event));
    }

    toJSON(): GitHubUserActivityJSON {
        return {
            events: this.events.map(event => event.toJSON()),
            eventMaxLimit: this.eventMaxLimit
        };
    }

    static fromJSON(json: GitHubUserActivityJSON): GitHubUserActivity {
        return new GitHubUserActivity({
            events: json.events.map(event => GitHubUserActivityEvent.fromJSON(event)),
            eventMaxLimit: json.eventMaxLimit
        });
    }
}
