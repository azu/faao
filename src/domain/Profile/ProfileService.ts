// MIT © 2017 azu

import { GitHubSetting } from "../GitHubSetting/GitHubSetting";
import { GitHubSearchList } from "../GitHubSearchList/GitHubSearchList";
import { Profile, ProfileJSON } from "./Profile";
import { GitHubUser } from "../GitHubUser/GitHubUser";
import { DefaultEventMaxLimit } from "../GitHubUser/GitHubUserActivity";

export class ProfileService {
    /**
     * import profile and overwrite exist profile
     * @param profile
     */
    static toJSON(profile: Profile): ProfileJSON {
        return {
            GitHubSearchLists: profile.GitHubSearchLists.map(model => model.toJSON()),
            GitHubSettings: profile.GitHubSettings.map(model => model.toJSON()),
            GitHubUsers: profile.GitHubUsers
                ? profile.GitHubUsers.map(model => {
                      return {
                          ...model.toJSON(),
                          activity: undefined // remove activity
                      };
                  })
                : []
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
            GitHubSettings: profileJSON.GitHubSettings.map(json => GitHubSetting.fromJSON(json)),
            GitHubUsers: profileJSON.GitHubUsers
                ? profileJSON.GitHubUsers.map(json =>
                      GitHubUser.fromJSON({
                          ...json,
                          // activity always reset
                          activity: {
                              events: [],
                              eventMaxLimit: DefaultEventMaxLimit
                          }
                      })
                  )
                : []
        });
    }
}
