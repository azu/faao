// MIT © 2017 azu
import { GitHubUserActivityEvent, GitHubUserActivityEventJSON } from "./GitHubUserActivityEvent";
import { ValueObject } from "../ValueObject";
import { SearchFilter } from "../GitHubSearchStream/SearchFilter/SearchFilter";

const debug = require("debug")("faao:GitHubUserActivity");

export interface GitHubUserActivityJSON {
    events: GitHubUserActivityEventJSON[];
    eventMaxLimit: number;
}

export interface GitHubUserActivityArgs {
    filter?: SearchFilter;
    events: GitHubUserActivityEvent[];
    eventMaxLimit: number;
}

export const DefaultEventMaxLimit = 500;

export class GitHubUserActivity extends ValueObject {
    filter?: SearchFilter;
    rawEvents: GitHubUserActivityEvent[];
    events: GitHubUserActivityEvent[];
    eventMaxLimit: number;

    constructor(args: GitHubUserActivityArgs) {
        super();
        this.filter = args.filter;
        this.rawEvents = args.events;
        this.events = args.events;
        this.eventMaxLimit = args.eventMaxLimit;
        this.applyFilter(this.filter);
    }

    get rawEventCount(): number {
        return this.rawEvents.length;
    }

    /**
     * get method respect filter
     */
    getFirstEvent(): GitHubUserActivityEvent | undefined {
        return this.getEventAtIndex(0);
    }

    getEventAtIndex(index: number): GitHubUserActivityEvent | undefined {
        return this.events[index];
    }

    getNextEvent(currentEvent: GitHubUserActivityEvent): GitHubUserActivityEvent | undefined {
        const index = this.events.findIndex(event => {
            return event.equals(currentEvent);
        });
        return this.getEventAtIndex(index + 1);
    }

    getPrevEvent(currentEvent: GitHubUserActivityEvent): GitHubUserActivityEvent | undefined {
        const index = this.events.findIndex(event => {
            return event.equals(currentEvent);
        });
        return this.getEventAtIndex(index - 1);
    }

    applyFilter(filter?: SearchFilter): void {
        this.filter = filter;
        if (filter) {
            this.events = this.filterBySearchFilter(filter);
        } else {
            this.events = this.rawEvents.slice();
        }
    }

    filterBySearchFilter(filter: SearchFilter) {
        return this.rawEvents.filter(event => {
            return filter.isMatch(event);
        });
    }

    private addEvent(aEvent: GitHubUserActivityEvent) {
        const hasSameEvent = this.rawEvents.some(event => aEvent.equals(event));
        if (hasSameEvent) {
            return;
        }
        if (this.isReachedLimitMax) {
            this.rawEvents = this.rawEvents.slice(1, this.eventMaxLimit).concat(aEvent);
        } else {
            this.rawEvents = this.rawEvents.concat(aEvent);
        }
    }

    private get isReachedLimitMax() {
        return this.rawEvents.length > this.eventMaxLimit;
    }

    /**
     * add multiple events
     */
    mergeEvents(events: GitHubUserActivityEvent[]) {
        events.forEach(event => this.addEvent(event));
        this.applyFilter(this.filter);
    }

    toJSON(): GitHubUserActivityJSON {
        return {
            events: this.rawEvents.map(event => event.toJSON()),
            eventMaxLimit: this.eventMaxLimit
        };
    }

    static fromJSON(json: GitHubUserActivityJSON): GitHubUserActivity {
        return new GitHubUserActivity({
            events: json.events.map(event => GitHubUserActivityEvent.fromJSON(event)),
            eventMaxLimit: json.eventMaxLimit
        });
    }

    hasRecordedEvent(event: GitHubUserActivityEvent) {
        return this.rawEvents.some(thisEvent => thisEvent.equals(event));
    }
}
