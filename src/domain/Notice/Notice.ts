// MIT © 2017 azu
import { GenericErrorNotice } from "./GenericErrorNotice";
import { SearchQueryErrorNotice } from "./SearchQueryErrorNotice";

import ulid from "ulid";
import { Entity, Identifier } from "../Entity";

export type Notice = AbstractNotice | GenericErrorNotice | SearchQueryErrorNotice;

export abstract class AbstractNotice extends Entity<Identifier<AbstractNotice>> {
    abstract type: string;
    timeStamp: number;

    constructor() {
        super(new Identifier<AbstractNotice>(ulid()));
        this.timeStamp = Date.now();
    }
}
