// MIT © 2017 azu
import { AbstractNotice } from "./Notice";

export function isGenericErrorNotice(notice: AbstractNotice): notice is GenericErrorNotice {
    return notice.type === "GenericErrorNotice";
}

export class GenericErrorNotice extends AbstractNotice {
    error: Error;
    type = "GenericErrorNotice";

    constructor(error: Error) {
        super();
        this.error = error;
    }
}
