// MIT © 2017 azu
import { App, AppJSON } from "../App";

describe("App", () => {
    it("toJSON <-> fromJSON", () => {
        const json: AppJSON = {
            id: "01BK80E7K46WRSP4Y5634DGCJB",
            user: {
                activity: {
                    userEventHistory: {
                        items: [
                            {
                                id: "1234456543",
                                timeStamp: 1498139445848
                            }
                        ]
                    },
                    streamItemHistory: {
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
                    openedContent: {
                        type: "OpenedGitHubStream",
                        gitHubSearchStreamId: "01BK9992CN8HBNXM6PVKFWNGGR"
                    },
                    openedMenu: {
                        type: "OpenedGitHubSearchList",
                        gitHubSearchListId: "GitHubSearchList0",
                        query: {
                            name: "Faao",
                            query: "repo:azu/faao",
                            color: "#eb9694",
                            gitHubSettingId: "azu@github.com"
                        }
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
