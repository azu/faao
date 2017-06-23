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
                            }
                        ]
                    },
                    openedStreamId: "01BK9992CN8HBNXM6PVKFWNGGR",
                    openedItem: {
                        url: "https://api.github.com/repos/azu/faao/issues/43",
                        repositoryUrl: "https://api.github.com/repos/azu/faao",
                        labelsUrl: "https://api.github.com/repos/azu/faao/issues/43/labels{/name}",
                        commentsUrl: "https://api.github.com/repos/azu/faao/issues/43/comments",
                        eventsUrl: "https://api.github.com/repos/azu/faao/issues/43/events",
                        htmlUrl: "https://github.com/azu/faao/issues/43",
                        id: 238015343,
                        number: 43,
                        title: 'almin-logger: loud "Currently executing UseCases" log',
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
                        labels: [
                            {
                                id: 617235143,
                                url: "https://api.github.com/repos/azu/faao/labels/Type:%20Bug",
                                name: "Type: Bug",
                                color: "ee0701",
                                default: false
                            }
                        ],
                        state: "open",
                        locked: false,
                        assignee: null,
                        assignees: [],
                        milestone: null,
                        comments: 0,
                        createdAt: "2017-06-23T01:18:21Z",
                        updatedAt: "2017-06-23T01:18:21Z",
                        closedAt: null,
                        body:
                            'It seems that "Currently executing UseCases" is loudness.\r\n\r\nhttps://github.com/almin/almin/blob/2675d7c127479995ff36f1ee1ed232f785dbf34b/packages/almin-logger/src/AsyncLogger.js#L133\r\n\r\nIt will be logged at once during stores.',
                        score: 1
                    },
                    openedSearchListId: "GitHubSearchList0",
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
