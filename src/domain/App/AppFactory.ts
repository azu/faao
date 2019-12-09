// MIT © 2017 azu
import { AppUser } from "./AppUser";
import { App } from "./App";
import { AppUserActivity } from "./AppUserActivity";
import { AppNetwork } from "./AppNetwork";
import { ActivityHistory } from "./ActivityHistory";
import { Identifier } from "../Entity";
import { ulid } from "ulid";
import { GitHubSearchResultItem } from "../GitHubSearchStream/GitHubSearchResultItem";
import { GitHubUserActivityEvent } from "../GitHubUser/GitHubUserActivityEvent";
import { NotificationActivity } from "./NotificationActivity";
import { GitHubActiveItem } from "./Activity/GitHubActiveItem";

export class AppFactory {
    static create(): App {
        return new App({
            id: new Identifier<App>(ulid()),
            network: new AppNetwork("online"),
            user: new AppUser({
                activity: new AppUserActivity({
                    streamItemHistory: new ActivityHistory<GitHubActiveItem>([]),
                    userEventHistory: new ActivityHistory<GitHubUserActivityEvent>([]),
                    notificationActivity: new NotificationActivity({
                        timeStamp: Date.now()
                    })
                })
            })
        });
    }
}
