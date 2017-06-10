// MIT © 2017 azu
import { GenericErrorNotice, isGenericErrorNotice } from "./GenericErrorNotice";
import { isSearchQueryErrorNotice, SearchQueryErrorNotice } from "./SearchQueryErrorNotice";

let id = 0;

export type Notice = AbstractNotice | GenericErrorNotice | SearchQueryErrorNotice;

export abstract class AbstractNotice {
    id: string;
    type: string;
    message: string;
    timeStamp: number;

    constructor() {
        this.id = `Notice${id++}`;
        this.timeStamp = Date.now();
    }
}
