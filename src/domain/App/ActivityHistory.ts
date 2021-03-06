// MIT © 2017 azu
import { Identifier } from "../Entity";
import { splice } from "@immutable-array/prototype";
import { SortedCollectionItem } from "../GitHubSearchStream/SortedCollection";

export interface ActivityHistoryItemJSON {
    id: string;
    timeStamp: number;
}

export interface ActivityHistoryItemArgs<T> {
    id: Identifier<T>;
    timeStamp: number;
}

export class ActivityHistoryItem<T> {
    id: Identifier<T>;
    timeStamp: number;

    constructor(item: ActivityHistoryItemArgs<T>) {
        this.id = item.id;
        this.timeStamp = item.timeStamp;
    }

    toJSON(): ActivityHistoryItemJSON {
        return {
            id: this.id.toValue(),
            timeStamp: this.timeStamp
        };
    }

    // FIXME: any should be T
    static fromJSON(json: ActivityHistoryItemJSON): ActivityHistoryItem<any> {
        return new ActivityHistoryItem({
            id: new Identifier<any>(json.id),
            timeStamp: json.timeStamp
        });
    }
}

export interface ActivityHistoryJSON {
    items: ActivityHistoryItemJSON[];
}

export enum WhenReadItem {
    UNREAD = 0,
    RECENT = 1,
    OLDER = 2
}

/**
 * Adding only history
 */
export class ActivityHistory<T> {
    items: ActivityHistoryItem<T>[];
    limit: number;

    constructor(items: ActivityHistoryItem<T>[], limit = 1000) {
        this.items = items;
        this.limit = limit;
    }

    readItem(aItem: ActivityHistoryItem<T>) {
        const items = this.items;
        const existItemIndex = items.findIndex(item => item.id.equals(aItem.id));
        if (existItemIndex !== -1) {
            this.items = splice(items, existItemIndex, 1, aItem);
            return;
        }
        if (items.length >= this.limit) {
            this.items = items.slice(1).concat(aItem);
            return;
        }
        this.items = items.concat(aItem);
    }

    whenReadItem(sortedItem: SortedCollectionItem): WhenReadItem {
        const index = this.items.findIndex(item => {
            return item.id.equals(sortedItem.id);
        });
        if (index === -1) {
            return WhenReadItem.UNREAD;
        }
        const lastIndex = this.items.length - index;
        if (0 <= lastIndex && lastIndex <= 3) {
            return WhenReadItem.RECENT;
        }
        return WhenReadItem.OLDER;
    }

    findById(itemId: Identifier<T>): ActivityHistoryItem<T> | undefined {
        return this.items.find(item => item.id.equals(itemId));
    }

    isRead(itemId: Identifier<T>, readTimeStamp: Date): boolean {
        const matchItem = this.findById(itemId);
        if (!matchItem) {
            return false;
        }
        return matchItem.timeStamp >= readTimeStamp.getTime();
    }

    toJSON() {
        return {
            items: this.items.map(item => item.toJSON())
        };
    }

    static fromJSON(json: ActivityHistoryJSON) {
        return new ActivityHistory(
            json.items.map(item => ActivityHistoryItem.fromJSON(item)),
            1000
        );
    }
}
