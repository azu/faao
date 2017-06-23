// MIT © 2017 azu
export interface AppNetworkJSON {}

export type AppNetworkStatus = "online" | "offline";

export class AppNetwork {
    constructor(public status: AppNetworkStatus) {}

    isOnline(): boolean {
        return this.status === "online";
    }

    online() {
        return new AppNetwork("online");
    }

    offline() {
        return new AppNetwork("offline");
    }
}
