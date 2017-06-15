// MIT © 2017 azu

import { GitHubSetting } from "../GitHubSetting/GitHubSetting";
import { GitHubSearchList } from "../GitHubSearch/GitHubSearchList/GitHubSearchList";
import { Profile, ProfileJSON } from "./Profile";

export class ProfileService {
    /**
     * import profile and overwrite exist profile
     * @param profile
     */
    static toJSON(profile: Profile): ProfileJSON {
        return {
            GitHubSearchLists: profile.GitHubSearchLists.map(model => model.toJSON()),
            GitHubSettings: profile.GitHubSettings.map(model => model.toJSON())
        };
    }

    /**
     * export exist profile data as Profile
     */
    static fromJSON(profileJSON: ProfileJSON): Profile {
        return new Profile({
            GitHubSearchLists: profileJSON.GitHubSearchLists.map(json =>
                GitHubSearchList.fromJSON(json)
            ),
            GitHubSettings: profileJSON.GitHubSettings.map(json => GitHubSetting.fromJSON(json))
        });
    }
}
