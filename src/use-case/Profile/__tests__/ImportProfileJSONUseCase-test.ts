// MIT © 2017 azu
import { ImportProfileJSONUseCase } from "../ImportProfileJSONUseCase";
import { GitHubSettingRepository } from "../../../infra/repository/GitHubSettingsRepository";
import { GitHubSearchListRepository } from "../../../infra/repository/GitHubSearchListRepository";
import { GitHubSearchListFactory } from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchListFactory";
import { createStubContext } from "../../../test/AlminUseCaseStub";
import { ProfileJSON } from "../../../domain/Profile/Profile";
import { storageManger } from "../../../infra/repository/Storage";

describe("ImportProfileJSONUseCase", () => {
    beforeEach(() => {
        return storageManger.useMemoryDriver();
    });
    it("should overwrite exist profile", async () => {
        const gitHubSettingRepository = new GitHubSettingRepository();
        const gitHubSearchListRepository = new GitHubSearchListRepository(
            GitHubSearchListFactory.createDefaultSearchList()
        );
        await gitHubSettingRepository.ready();
        await gitHubSearchListRepository.ready();
        const { context } = createStubContext(ImportProfileJSONUseCase);
        const importProfileJSONUseCase = new ImportProfileJSONUseCase({
            gitHubSearchListRepository,
            gitHubSettingRepository
        });
        const profileJSON: ProfileJSON = {
            GitHubSettings: [
                {
                    id: "github.com",
                    token: "GitHubSetting_Token_1",
                    apiHost: "https://api.github.com",
                    webHost: "https://github.com"
                },
                {
                    id: "ghe",
                    token: "GitHubSetting_Token_2",
                    apiHost: "https://example.com/api/v3",
                    webHost: "https://example.com"
                }
            ],
            GitHubSearchLists: [
                {
                    id: "id1",
                    name: "SearchList_1",
                    queries: [
                        {
                            name: "query_a",
                            query: "repo:azu/faao",
                            color: "#000000",
                            gitHubSettingId: "github.com"
                        },
                        {
                            name: "query_b",
                            query: "repo:example/example",
                            color: "#ffffff",
                            gitHubSettingId: "github.com"
                        }
                    ]
                },
                {
                    id: "id2",
                    name: "SearchList_2",
                    queries: [
                        {
                            name: "query_a",
                            query: "repo:ghe/ghe",
                            color: "#000111",
                            gitHubSettingId: "ghe"
                        },
                        {
                            name: "query_b",
                            query: "repo:example/example",
                            color: "#ffffff",
                            gitHubSettingId: "github.com"
                        }
                    ]
                }
            ]
        };
        return context
            .useCase(importProfileJSONUseCase)
            .executor(useCase => useCase.execute(profileJSON))
            .then(() => {
                expect(gitHubSettingRepository.findAll()).toHaveLength(2);
                expect(gitHubSearchListRepository.findAll()).toHaveLength(2);
            });
    });
});
