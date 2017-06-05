// MIT © 2017 azu
import { AppUser } from "./AppUser";
import { App } from "./App";
import { AppUserActivity } from "./AppUserActivity";

export class AppFactory {
    static create(): App {
        return new App({
            user: new AppUser({
                activity: new AppUserActivity()
            })
        });
    }
}
