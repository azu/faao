// MIT © 2017 azu
import { Notice, NoticeArgs } from "../Notice";

export interface GenericErrorNoticeArgs extends NoticeArgs {
    error: Error;
}

export class GenericErrorNotice extends Notice {
    error: Error;

    constructor(args: GenericErrorNoticeArgs) {
        super(args);
        this.error = args.error;
    }
}
