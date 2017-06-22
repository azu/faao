// MIT © 2017 azu
import { App } from "../App";

describe("App", () => {
    it("toJSON <-> fromJSON", () => {
        const json = {
            id: "01BK80E7K46WRSP4Y5634DGCJB",
            user: {
                activity: {
                    itemHistory: {
                        items: [
                            {
                                id: "237433612",
                                timeStamp: 1498139445848
                            },
                            { id: "237433612", timeStamp: 1498139474414 },
                            {
                                id: "237433612",
                                timeStamp: 1498139553875
                            },
                            { id: "237433612", timeStamp: 1498139555219 }
                        ]
                    },
                    openedItem: {
                        url: "https://api.github.com/repos/azu/faao/issues/42",
                        repositoryUrl: "https://api.github.com/repos/azu/faao",
                        labelsUrl: "https://api.github.com/repos/azu/faao/issues/42/labels{/name}",
                        commentsUrl: "https://api.github.com/repos/azu/faao/issues/42/comments",
                        eventsUrl: "https://api.github.com/repos/azu/faao/issues/42/events",
                        htmlUrl: "https://github.com/azu/faao/issues/42",
                        id: 237433612,
                        number: 42,
                        title: "Prevent link",
                        user: {
                            login: "azu",
                            id: 19714,
                            avatarUrl: "https://avatars2.githubusercontent.com/u/19714?v=3",
                            gravatarId: "",
                            url: "https://api.github.com/users/azu",
                            htmlUrl: "https://github.com/azu",
                            followersUrl: "https://api.github.com/users/azu/followers",
                            followingUrl: "https://api.github.com/users/azu/following{/other_user}",
                            gistsUrl: "https://api.github.com/users/azu/gists{/gist_id}",
                            starredUrl: "https://api.github.com/users/azu/starred{/owner}{/repo}",
                            subscriptionsUrl: "https://api.github.com/users/azu/subscriptions",
                            organizationsUrl: "https://api.github.com/users/azu/orgs",
                            reposUrl: "https://api.github.com/users/azu/repos",
                            eventsUrl: "https://api.github.com/users/azu/events{/privacy}",
                            receivedEventsUrl: "https://api.github.com/users/azu/received_events",
                            type: "User",
                            siteAdmin: false
                        },
                        labels: [],
                        state: "open",
                        locked: false,
                        assignee: null,
                        assignees: [],
                        milestone: null,
                        comments: 0,
                        createdAt: "2017-06-21T07:01:04Z",
                        updatedAt: "2017-06-21T07:01:04Z",
                        closedAt: null,
                        body:
                            "Prevent link transion in the window.\r\nAlways open in default browser.",
                        score: 1
                    },
                    openedQuery: {
                        name: "Faao",
                        query: "repo:azu/faao",
                        color: "#eb9694",
                        gitHubSettingId: "azu@github.com"
                    }
                }
            }
        };
        const app = App.fromJSON(json);
        expect(app).toBeInstanceOf(App);
        const reJSON = app.toJSON();
        expect(reJSON).toEqual(json);
    });
});
