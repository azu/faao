// MIT © 2017 azu
import { AppUser } from "./AppUser";
import { App, AppJSON } from "./App";
import { AppUserActivity } from "./AppUserActivity";
import { AppNetwork } from "./AppNetwork";
import { ActivityHistory, ActivityHistoryItem } from "./ActivityHistory";

export interface AppFactoryArgs {
    itemHistoryItems: ActivityHistoryItem[];
}

export class AppFactory {
    static create(args: AppFactoryArgs): App {
        return new App({
            network: new AppNetwork("online"),
            user: new AppUser({
                activity: new AppUserActivity({
                    itemHistory: new ActivityHistory(args.itemHistoryItems)
                })
            })
        });
    }

    static toJSON(app: App): AppJSON {
        return {
            id: app.id,
            user: {
                activity: {
                    itemHistory: {
                        items: app.user.activity.itemHistory.items.map(item => item.toJSON())
                    }
                }
            }
        };
    }
}
