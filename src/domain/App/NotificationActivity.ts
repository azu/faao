// MIT © 2017 azu
import { Identifier } from "../Entity";
import { splice } from "@immutable-array/prototype";

export interface NotificationActivityJSON {
    timeStamp: number;
}

export interface NotificationActivityProps {
    timeStamp: number;
}

/**
 * Adding only history
 */
export class NotificationActivity {
    timeStamp: number;

    constructor(props: NotificationActivityProps) {
        this.timeStamp = props.timeStamp;
    }

    toJSON() {
        return {
            timeStamp: this.timeStamp
        };
    }

    static fromJSON(json: NotificationActivityJSON) {
        return new NotificationActivity({
            timeStamp: json.timeStamp
        });
    }
}
