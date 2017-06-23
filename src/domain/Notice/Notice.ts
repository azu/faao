// MIT © 2017 azu
import { GenericErrorNotice } from "./GenericErrorNotice";
import { SearchQueryErrorNotice } from "./SearchQueryErrorNotice";

import ulid from "ulid";

export type Notice = AbstractNotice | GenericErrorNotice | SearchQueryErrorNotice;

export abstract class AbstractNotice {
    id: string;
    type: string;
    message: string;
    timeStamp: number;

    constructor() {
        this.id = ulid();
        this.timeStamp = Date.now();
    }
}
