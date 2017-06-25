// MIT © 2017 azu
import { AppUser, AppUserJSON } from "./AppUser";
import { AppNetwork, AppNetworkStatus } from "./AppNetwork";
import { Entity, Identifier } from "../Entity";

export interface AppJSON {
    id: string;
    user: AppUserJSON;
}

export interface AppArgs {
    id: Identifier<App>;
    user: AppUser;
    network: AppNetwork;
}

export class App extends Entity<Identifier<App>> {
    user: AppUser;
    network: AppNetwork;

    constructor(args: AppArgs) {
        super(args.id);
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
        return new this({
            id: new Identifier<App>(json.id),
            user: AppUser.fromJSON(json.user),
            network: new AppNetwork("offline")
        });
    }

    toJSON(): AppJSON {
        return {
            id: this.id.toValue(),
            user: this.user.toJSON()
        };
    }
}
