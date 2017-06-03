// MIT © 2017 azu
import { AppUser } from "./AppUser";

let id = 0;

export interface AppArgs {
    user: AppUser;
}

export class App {
    readonly id: string;
    readonly user: AppUser;

    constructor(args: AppArgs) {
        this.id = `App${id++}`;
        this.user = args.user;
    }
}