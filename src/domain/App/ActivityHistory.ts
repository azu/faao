// MIT © 2017 azu
import { GitHubSearchResultItem } from "../GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { Identifier } from "../Entity";

export interface ActivityHistoryItemJSON {
    id: string;
    timeStamp: number;
}

export interface ActivityHistoryItemArgs {
    id: Identifier<GitHubSearchResultItem>;
    timeStamp: number;
}

export class ActivityHistoryItem {
    id: Identifier<GitHubSearchResultItem>;
    timeStamp: number;

    constructor(item: ActivityHistoryItemArgs) {
        this.id = item.id;
        this.timeStamp = item.timeStamp;
    }

    toJSON(): ActivityHistoryItemJSON {
        return {
            id: this.id.toValue(),
            timeStamp: this.timeStamp
        };
    }

    static fromJSON(json: ActivityHistoryItemJSON): ActivityHistoryItem {
        return new ActivityHistoryItem({
            id: new Identifier<GitHubSearchResultItem>(json.id),
            timeStamp: json.timeStamp
        });
    }
}

export interface ActivityHistoryJSON {
    items: ActivityHistoryItemJSON[];
}

function immutableSplice(arr: any[], start: number, deleteCount: number, ...items: any[]) {
    return [...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount)];
}

/**
 * Adding only history
 */
export class ActivityHistory {
    items: ActivityHistoryItem[];
    limit: number;

    constructor(items: ActivityHistoryItem[], limit = 1000) {
        this.items = items;
        this.limit = limit;
    }

    readItem(aItem: ActivityHistoryItem) {
        const items = this.items;
        const existItemIndex = this.items.findIndex(item => item.id.equals(aItem.id));
        if (existItemIndex) {
            this.items = immutableSplice(this.items, existItemIndex, 1, aItem);
            return;
        }
        if (items.length > this.limit) {
            items.shift();
        }
        this.items = items.concat(aItem);
    }

    isRead(aItem: GitHubSearchResultItem): boolean {
        const matchItem = this.items.find(item => item.id.equals(aItem.id));
        if (!matchItem) {
            return false;
        }
        return matchItem.timeStamp >= aItem.updatedAtDate.getTime();
    }

    toJSON() {
        return {
            items: this.items.map(item => item.toJSON())
        };
    }

    static fromJSON(json: ActivityHistoryJSON) {
        const history = Object.create(ActivityHistory.prototype);
        return Object.assign(history, {
            items: json.items.map(item => ActivityHistoryItem.fromJSON(item))
        });
    }
}
