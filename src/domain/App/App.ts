// MIT © 2017 azu
import { AppUser, AppUserJSON } from "./AppUser";
import { AppNetwork, AppNetworkStatus } from "./AppNetwork";

import ulid from "ulid";

export interface AppArgs {
    user: AppUser;
    network: AppNetwork;
}

export interface AppJSON {
    id: string;
    user: AppUserJSON;
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

    static fromJSON(json: AppJSON): App {
        const proto = Object.create(this.prototype);
        return Object.assign(proto, {
            id: json.id,
            user: AppUser.fromJSON(json.user),
            network: new AppNetwork("offline")
        });
    }

    toJSON(): AppJSON {
        return {
            id: this.id,
            user: this.user.toJSON()
        };
    }
}
