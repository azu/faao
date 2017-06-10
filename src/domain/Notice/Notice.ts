// MIT © 2017 azu
let id = 0;

export interface NoticeArgs {
    id: string;
    message: string;
}

export abstract class Notice {
    id: string;
    message: string;
    timeStamp: number;

    constructor(args: NoticeArgs) {
        this.id = `Notice${id++}`;
        this.message = args.message;
        this.timeStamp = Date.now();
    }
}
