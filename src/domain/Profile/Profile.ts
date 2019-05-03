// MIT © 2017 azu
import { GitHubSearchList } from "../GitHubSearchList/GitHubSearchList";
import { GitHubSetting } from "../GitHubSetting/GitHubSetting";
import { GitHubUser } from "../GitHubUser/GitHubUser";
import { GitHubSearchQueryJSON } from "../GitHubSearchList/GitHubSearchQuery";
import { FaaoSearchQueryJSON } from "../GitHubSearchList/FaaoSearchQuery";
import { QueryRoleJSON } from "../GitHubSearchList/QueryRole";

// Q. Why define duplicated interface?
// A. We should define exportable data by manually
// In other word, export data is not same with saving data.
export interface ProfileJSON {
    GitHubSettings: {
        id: string;
        token: string;
        apiHost: string;
        webHost: string;
        // relationship
        gitHubUserId?: string;
    }[];
    GitHubSearchLists: {
        id: string;
        name: string;
        queries: (FaaoSearchQueryJSON | GitHubSearchQueryJSON)[];
    }[];
    GitHubUsers?: {
        id: string;
        profile?: {
            loginName: string;
            avatarURL: string;
        };
    }[];
}

export interface ProfileArgs {
    GitHubSettings: GitHubSetting[];
    GitHubSearchLists: GitHubSearchList[];
    GitHubUsers?: GitHubUser[];
}

export class Profile {
    GitHubSettings: GitHubSetting[];
    GitHubSearchLists: GitHubSearchList[];
    GitHubUsers?: GitHubUser[];
    constructor(args: ProfileArgs) {
        this.GitHubSettings = args.GitHubSettings;
        this.GitHubSearchLists = args.GitHubSearchLists;
        this.GitHubUsers = args.GitHubUsers;
    }
}
