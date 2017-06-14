// MIT © 2017 azu
import { AppUser } from "./AppUser";
import { AppNetwork, AppNetworkStatus } from "./AppNetwork";

const ulid = require("ulid");
export interface AppArgs {
    user: AppUser;
    network: AppNetwork;
}

export class App {
    id: string;
    user: AppUser;
    network: AppNetwork;

    constructor(args: AppArgs) {
        this.id = ulid();
        this.user = args.user;
        this.network = args.network;
    }

    updateNetworkStatus(status: AppNetworkStatus) {
        if (this.network.status === status) {
            return;
        }
        this.network = status === "online" ? this.network.online() : this.network.offline();
    }
}
