// MIT © 2017 azu
import { AppUser } from "./AppUser";
import { App } from "./App";
import { AppUserActivity } from "./AppUserActivity";
import { AppNetwork } from "./AppNetwork";

export class AppFactory {
    static create(): App {
        return new App({
            network: new AppNetwork("online"),
            user: new AppUser({
                activity: new AppUserActivity()
            })
        });
    }
}
