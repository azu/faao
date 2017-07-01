// MIT © 2017 azu
import { GitHubUser } from "../GitHubUser";

describe("GitHubUser", () => {
    it("should toJSON <-> fromJSON", () => {
        const gitHubUser = GitHubUser.fromJSON({
            id: "user a",
            activity: {
                events: [
                    {
                        id: "6143438277",
                        type: "CreateEvent",
                        actor: {
                            id: 19714,
                            login: "azu",
                            gravatar_id: "",
                            url: "https://api.github.com/users/azu",
                            avatar_url: "https://avatars.githubusercontent.com/u/19714?"
                        },
                        repo: {
                            id: 21963095,
                            name: "jser/jser.github.io",
                            url: "https://api.github.com/repos/jser/jser.github.io"
                        },
                        payload: {
                            ref: "pushdog",
                            ref_type: "branch",
                            master_branch: "develop",
                            description: "JSer.infoのブログリポジトリ",
                            pusher_type: "user"
                        },
                        public: true,
                        created_at: "2017-06-27T05:38:50Z",
                        org: {
                            id: 8184731,
                            login: "jser",
                            gravatar_id: "",
                            url: "https://api.github.com/orgs/jser",
                            avatar_url: "https://avatars.githubusercontent.com/u/8184731?"
                        }
                    }
                ],
                eventMaxLimit: 100
            }
        });
        const reJSON = gitHubUser.toJSON();
        const reEntity = GitHubUser.fromJSON(reJSON);
        expect(reEntity.toJSON()).toEqual(reJSON);
    });
});
