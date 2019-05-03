import { GitHubClient } from "../GitHubClient";
import { GitHubSetting } from "../../../domain/GitHubSetting/GitHubSetting";
import { GitHubSearchQueryFactory } from "../../../domain/GitHubSearchList/GitHubSearchQueryFactory";
import { FaaoSearchQuery } from "../../../domain/GitHubSearchList/FaaoSearchQuery";
import { FaaoSearchQueryParams } from "../../../domain/GitHubSearchList/FaaoSearchQueryParams";
import { FaaoSearchQueryParam } from "../../../domain/GitHubSearchList/FaaoSearchQueryParam";

const GH_TOKEN = process.env.TEST_GH_TOKEN;
describe("GitHubClient", function() {
    if (!GH_TOKEN) {
        it("skip all. test needs process.env.GH_TOKEN", () => {});
        return; // skip
    }
    const gitHubSettingId = "azu@github.com";
    const config = GitHubSetting.fromJSON({
        id: gitHubSettingId,
        token: GH_TOKEN,
        apiHost: "https://api.github.com",
        webHost: "https://github.com"
    });
    describe("#search", () => {
        it("search GitHubSearchQuery and pass results to progress callback", done => {
            const client = new GitHubClient(config);
            return client.search(
                GitHubSearchQueryFactory.createFromJSON({
                    color: "#fff",
                    gitHubSettingId: gitHubSettingId,
                    name: "faao",
                    query: "repo:azu/faao Quick Issue"
                }),
                searchResult => {
                    console.log(searchResult.items);
                    expect(searchResult.items).toBeDefined();
                    return Promise.resolve(true);
                },
                (error: any) => {
                    done(error);
                },
                () => {
                    done();
                }
            );
        });
        it("search FaaoSearchQuery and pass results to progress callback", done => {
            jest.setTimeout(20 * 1000);
            const client = new GitHubClient(config);
            const params = [
                FaaoSearchQueryParam.fromJSON({
                    url: "https://github.com/azu/faao/issues/1"
                }),
                FaaoSearchQueryParam.fromJSON({
                    url: "https://github.com/azu/faao/issues/2"
                }),
                FaaoSearchQueryParam.fromJSON({
                    url: "https://github.com/azu/faao/pull/10"
                })
            ];
            return client.search(
                FaaoSearchQuery.fromJSON({
                    color: "#fff",
                    gitHubSettingId: gitHubSettingId,
                    name: "faao issues",
                    searchParams: FaaoSearchQueryParams.fromJSON({
                        params: params
                    })
                }),
                searchResult => {
                    expect(searchResult.items).toHaveLength(params.length);
                    return Promise.resolve(true);
                },
                (error: any) => {
                    done(error);
                },
                () => {
                    done();
                }
            );
        });
    });
});
