// MIT © 2017 azu
import { createStubContext } from "../../../test/AlminUseCaseStub";
import {
    CloseSettingPanelUseCase,
    CloseSettingPanelUseCasePayload,
    OpenSettingPanelUseCase,
    OpenSettingPanelUseCasePayload
} from "../ToggleSettingPanelUseCase";
import { GitHubSetting } from "../../../domain/GitHubSetting/GitHubSetting";

describe("ToggleSettingPanelUseCase", () => {
    describe("OpenSettingPanelUseCase", () => {
        it("should dispatch OpenSettingPanelUseCasePayload", () => {
            const { dispatchedPayloads, context } = createStubContext(OpenSettingPanelUseCase);
            return context
                .useCase(new OpenSettingPanelUseCase())
                .execute()
                .then(() => {
                    expect(dispatchedPayloads[0]).toBeInstanceOf(OpenSettingPanelUseCasePayload);
                });
        });
        it("can execute with exist setting", () => {
            const { dispatchedPayloads, context } = createStubContext(OpenSettingPanelUseCase);
            const setting = GitHubSetting.fromJSON({
                id: "azu@github.com",
                token: "xxx",
                apiHost: "https://api.github.com",
                webHost: "https://github.com"
            });
            return context
                .useCase(new OpenSettingPanelUseCase())
                .execute(setting)
                .then(() => {
                    const payload: OpenSettingPanelUseCasePayload = dispatchedPayloads[0];
                    expect(payload).toBeInstanceOf(OpenSettingPanelUseCasePayload);
                    expect(payload.setting).toBe(setting);
                });
        });
    });
    describe("CloseSettingPanelUseCase", () => {
        it("should dispatch CloseSettingPanelUseCasePayload", () => {
            const { dispatchedPayloads, context } = createStubContext(CloseSettingPanelUseCase);
            return context
                .useCase(new CloseSettingPanelUseCase())
                .execute()
                .then(() => {
                    expect(dispatchedPayloads[0]).toBeInstanceOf(CloseSettingPanelUseCasePayload);
                });
        });
    });
});
